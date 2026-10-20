import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Room, Guest, Booking, InventoryStock, InventoryLog, RoomStatus, BookingStatus } from '../types';
import { INITIAL_ROOMS, INITIAL_GUESTS, INITIAL_BOOKINGS, INITIAL_INVENTORY, INITIAL_INVENTORY_LOGS } from '../lib/mockData';
import { getSupabaseClient, getSupabaseCredentials, resetSupabaseClient } from '../lib/supabase';

interface HotelContextType {
  rooms: Room[];
  guests: Guest[];
  bookings: Booking[];
  inventory: InventoryStock[];
  inventoryLogs: InventoryLog[];
  loading: boolean;
  isLiveSupabase: boolean;
  supabaseError: string | null;
  supabaseUrl: string;
  supabaseKey: string;
  setSupabaseConfig: (url: string, key: string) => Promise<boolean>;
  updateRoomStatus: (roomId: string, status: RoomStatus) => Promise<void>;
  updateRoomPrice: (roomId: string, price: number) => Promise<void>;
  addGuest: (guest: Omit<Guest, 'id' | 'created_at'>) => Promise<Guest>;
  updateGuest: (id: string, guest: Partial<Guest>) => Promise<void>;
  addBooking: (booking: Omit<Booking, 'id' | 'created_at'>) => Promise<Booking>;
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  registerStockChange: (itemId: string, changeAmount: number, type: 'in' | 'out', reason: string) => Promise<void>;
  addInventoryItem: (item: Omit<InventoryStock, 'id'>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('hotel_riss_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem('hotel_riss_guests');
    return saved ? JSON.parse(saved) : INITIAL_GUESTS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('hotel_riss_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [inventory, setInventory] = useState<InventoryStock[]>(() => {
    const saved = localStorage.getItem('hotel_riss_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>(() => {
    const saved = localStorage.getItem('hotel_riss_logs');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY_LOGS;
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [isLiveSupabase, setIsLiveSupabase] = useState<boolean>(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  const creds = getSupabaseCredentials();
  const [supabaseUrl, setSupabaseUrl] = useState<string>(creds.url);
  const [supabaseKey, setSupabaseKey] = useState<string>(creds.key);

  // Sync state to localStorage for offline / mock durability
  useEffect(() => {
    if (!isLiveSupabase) {
      localStorage.setItem('hotel_riss_rooms', JSON.stringify(rooms));
      localStorage.setItem('hotel_riss_guests', JSON.stringify(guests));
      localStorage.setItem('hotel_riss_bookings', JSON.stringify(bookings));
      localStorage.setItem('hotel_riss_inventory', JSON.stringify(inventory));
      localStorage.setItem('hotel_riss_logs', JSON.stringify(inventoryLogs));
    }
  }, [rooms, guests, bookings, inventory, inventoryLogs, isLiveSupabase]);

  // Load data from Supabase if configured, or gracefully fallback
  const refreshData = useCallback(async () => {
    setLoading(true);
    setSupabaseError(null);
    const client = getSupabaseClient();

    if (!client) {
      setIsLiveSupabase(false);
      setLoading(false);
      return;
    }

    try {
      const [roomsRes, guestsRes, bookingsRes, invRes, logsRes] = await Promise.all([
        client.from('rooms').select('*').order('room_number', { ascending: true }),
        client.from('guests').select('*').order('created_at', { ascending: false }),
        client.from('bookings').select('*, guest:guests(*), room:rooms(*)').order('check_in', { ascending: false }),
        client.from('inventory_stock').select('*').order('item_name', { ascending: true }),
        client.from('inventory_log').select('*, item:inventory_stock(*)').order('created_at', { ascending: false }).limit(50),
      ]);

      if (roomsRes.error) throw roomsRes.error;
      if (guestsRes.error) throw guestsRes.error;
      if (bookingsRes.error) throw bookingsRes.error;
      if (invRes.error) throw invRes.error;

      // If database is empty (no rooms yet), seed or keep mock
      if (roomsRes.data && roomsRes.data.length > 0) {
        setRooms(roomsRes.data as Room[]);
      }
      if (guestsRes.data && guestsRes.data.length > 0) {
        setGuests(guestsRes.data as Guest[]);
      }
      if (bookingsRes.data) {
        setBookings(bookingsRes.data as Booking[]);
      }
      if (invRes.data && invRes.data.length > 0) {
        setInventory(invRes.data as InventoryStock[]);
      }
      if (logsRes.data) {
        setInventoryLogs(logsRes.data as InventoryLog[]);
      }

      setIsLiveSupabase(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.warn('Supabase fetch failed; running with local state:', errorMessage);
      setSupabaseError(errorMessage);
      setIsLiveSupabase(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Configure Supabase credentials
  const setSupabaseConfig = async (url: string, key: string): Promise<boolean> => {
    resetSupabaseClient(url, key);
    setSupabaseUrl(url);
    setSupabaseKey(key);
    const client = getSupabaseClient();
    if (!client) {
      setIsLiveSupabase(false);
      return false;
    }

    try {
      const { error } = await client.from('rooms').select('id').limit(1);
      if (error) throw error;
      setIsLiveSupabase(true);
      await refreshData();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al conectar con Supabase';
      setSupabaseError(msg);
      setIsLiveSupabase(false);
      return false;
    }
  };

  // ROOM ACTIONS
  const updateRoomStatus = async (roomId: string, status: RoomStatus) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status } : r));
    const client = getSupabaseClient();
    if (client && isLiveSupabase) {
      await client.from('rooms').update({ status }).eq('id', roomId);
    }
  };

  const updateRoomPrice = async (roomId: string, price: number) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, price_per_night: price } : r));
    const client = getSupabaseClient();
    if (client && isLiveSupabase) {
      await client.from('rooms').update({ price_per_night: price }).eq('id', roomId);
    }
  };

  // GUEST ACTIONS
  const addGuest = async (guestData: Omit<Guest, 'id' | 'created_at'>): Promise<Guest> => {
    const client = getSupabaseClient();
    if (client && isLiveSupabase) {
      const { data, error } = await client.from('guests').insert([guestData]).select().single();
      if (error) throw error;
      setGuests(prev => [data as Guest, ...prev]);
      return data as Guest;
    } else {
      const newGuest: Guest = {
        ...guestData,
        id: `g-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      setGuests(prev => [newGuest, ...prev]);
      return newGuest;
    }
  };

  const updateGuest = async (id: string, guestData: Partial<Guest>) => {
    setGuests(prev => prev.map(g => g.id === id ? { ...g, ...guestData } : g));
    const client = getSupabaseClient();
    if (client && isLiveSupabase) {
      await client.from('guests').update(guestData).eq('id', id);
    }
  };

  // BOOKING ACTIONS
  const addBooking = async (bookingData: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> => {
    const client = getSupabaseClient();
    if (client && isLiveSupabase) {
      const { data, error } = await client.from('bookings').insert([bookingData]).select('*, guest:guests(*), room:rooms(*)').single();
      if (error) throw error;
      setBookings(prev => [data as Booking, ...prev]);
      // Update room status if check_in is today or ongoing
      const today = new Date().toISOString().split('T')[0];
      if (bookingData.check_in <= today && bookingData.check_out >= today) {
        await updateRoomStatus(bookingData.room_id, 'ocupada');
      }
      return data as Booking;
    } else {
      const room = rooms.find(r => r.id === bookingData.room_id);
      const guest = guests.find(g => g.id === bookingData.guest_id);
      const newBooking: Booking = {
        ...bookingData,
        id: `b-${Date.now()}`,
        created_at: new Date().toISOString(),
        room,
        guest
      };
      setBookings(prev => [newBooking, ...prev]);
      const today = new Date().toISOString().split('T')[0];
      if (bookingData.check_in <= today && bookingData.check_out >= today) {
        updateRoomStatus(bookingData.room_id, 'ocupada');
      }
      return newBooking;
    }
  };

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    const targetBooking = bookings.find(b => b.id === id);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));

    if (targetBooking) {
      if (status === 'checked_in') {
        await updateRoomStatus(targetBooking.room_id, 'ocupada');
      } else if (status === 'checked_out') {
        await updateRoomStatus(targetBooking.room_id, 'limpieza');
      } else if (status === 'cancelled') {
        await updateRoomStatus(targetBooking.room_id, 'disponible');
      }
    }

    const client = getSupabaseClient();
    if (client && isLiveSupabase) {
      await client.from('bookings').update({ status }).eq('id', id);
    }
  };

  const deleteBooking = async (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    const client = getSupabaseClient();
    if (client && isLiveSupabase) {
      await client.from('bookings').delete().eq('id', id);
    }
  };

  // INVENTORY ACTIONS
  const registerStockChange = async (itemId: string, changeAmount: number, type: 'in' | 'out', reason: string) => {
    const client = getSupabaseClient();
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    const newQty = type === 'in' ? item.quantity + changeAmount : Math.max(0, item.quantity - changeAmount);

    setInventory(prev => prev.map(i => i.id === itemId ? { ...i, quantity: newQty } : i));

    const newLog: InventoryLog = {
      id: `log-${Date.now()}`,
      item_id: itemId,
      change_amount: changeAmount,
      type,
      reason,
      created_at: new Date().toISOString(),
      item
    };
    setInventoryLogs(prev => [newLog, ...prev]);

    if (client && isLiveSupabase) {
      await client.from('inventory_log').insert([{
        item_id: itemId,
        change_amount: changeAmount,
        type,
        reason
      }]);
      // Trigger in postgres automatically updates inventory_stock, but we can also update explicitly
      await client.from('inventory_stock').update({ quantity: newQty, updated_at: new Date().toISOString() }).eq('id', itemId);
    }
  };

  const addInventoryItem = async (itemData: Omit<InventoryStock, 'id'>) => {
    const client = getSupabaseClient();
    if (client && isLiveSupabase) {
      const { data, error } = await client.from('inventory_stock').insert([itemData]).select().single();
      if (error) throw error;
      setInventory(prev => [...prev, data as InventoryStock]);
    } else {
      const newItem: InventoryStock = {
        ...itemData,
        id: `inv-${Date.now()}`,
        updated_at: new Date().toISOString()
      };
      setInventory(prev => [...prev, newItem]);
    }
  };

  return (
    <HotelContext.Provider value={{
      rooms,
      guests,
      bookings,
      inventory,
      inventoryLogs,
      loading,
      isLiveSupabase,
      supabaseError,
      supabaseUrl,
      supabaseKey,
      setSupabaseConfig,
      updateRoomStatus,
      updateRoomPrice,
      addGuest,
      updateGuest,
      addBooking,
      updateBookingStatus,
      deleteBooking,
      registerStockChange,
      addInventoryItem,
      refreshData
    }}>
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
