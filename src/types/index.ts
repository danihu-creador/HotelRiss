export type RoomType = 'individual_doble' | 'matrimonio';
export type RoomStatus = 'disponible' | 'ocupada' | 'limpieza' | 'mantenimiento';

export interface Room {
  id: string;
  room_number: string;
  floor: number;
  type: RoomType;
  status: RoomStatus;
  price_per_night: number;
  amenities?: string[];
  created_at?: string;
}

export interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  id_document: string;
  country?: string;
  notes?: string;
  created_at?: string;
}

export type BookingStatus = 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';

export interface Booking {
  id: string;
  room_id: string;
  guest_id: string;
  check_in: string; // YYYY-MM-DD
  check_out: string; // YYYY-MM-DD
  status: BookingStatus;
  total_price: number;
  special_requests?: string;
  created_at?: string;
  guest?: Guest;
  room?: Room;
}

export type InventoryCategory = 'limpieza' | 'minibar' | 'amenities' | 'mantenimiento';

export interface InventoryStock {
  id: string;
  item_name: string;
  category: InventoryCategory;
  quantity: number;
  min_stock_alert: number;
  unit: string;
  updated_at?: string;
}

export type InventoryLogType = 'in' | 'out';

export interface InventoryLog {
  id: string;
  item_id: string;
  change_amount: number;
  type: InventoryLogType;
  reason: string;
  created_at: string;
  item?: InventoryStock;
}
