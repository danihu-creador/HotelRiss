import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  User, 
  Bed
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import type { BookingStatus } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRoomId?: string;
  defaultDate?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  defaultRoomId,
  defaultDate
}) => {
  const { rooms, guests, addBooking, addGuest } = useHotel();

  // Form states
  const [roomId, setRoomId] = useState<string>('');
  const [guestId, setGuestId] = useState<string>('');
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [status, setStatus] = useState<BookingStatus>('confirmed');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // Quick guest creation toggle
  const [isCreatingNewGuest, setIsCreatingNewGuest] = useState<boolean>(false);
  const [newGuestData, setNewGuestData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    id_document: '',
    country: 'España'
  });

  // Prefill defaults on open
  useEffect(() => {
    if (isOpen) {
      const initialRoom = defaultRoomId || rooms[0]?.id || '';
      setRoomId(initialRoom);

      const today = new Date().toISOString().split('T')[0];
      const start = defaultDate || today;
      setCheckIn(start);

      // Check out is 2 days after checkIn by default
      const d = new Date(start);
      d.setDate(d.getDate() + 2);
      setCheckOut(d.toISOString().split('T')[0]);

      if (guests.length > 0) {
        setGuestId(guests[0].id);
      }
      setIsCreatingNewGuest(false);
      setSpecialRequests('');
      setStatus('confirmed');
    }
  }, [isOpen, defaultRoomId, defaultDate, rooms, guests]);

  if (!isOpen) return null;

  const selectedRoom = rooms.find(r => r.id === roomId);

  // Calculate nights and total price
  const calculateTotal = () => {
    if (!checkIn || !checkOut || !selectedRoom) return 0;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffTime = d2.getTime() - d1.getTime();
    const nights = Math.max(1, Math.round(diffTime / (1000 * 3600 * 24)));
    return nights * selectedRoom.price_per_night;
  };

  const nightsCount = () => {
    if (!checkIn || !checkOut) return 1;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffTime = d2.getTime() - d1.getTime();
    return Math.max(1, Math.round(diffTime / (1000 * 3600 * 24)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId || (!guestId && !isCreatingNewGuest) || !checkIn || !checkOut) {
      alert('Por favor, completa los campos requeridos');
      return;
    }

    if (checkOut <= checkIn) {
      alert('La fecha de salida debe ser posterior a la de entrada.');
      return;
    }

    let finalGuestId = guestId;

    if (isCreatingNewGuest) {
      if (!newGuestData.first_name || !newGuestData.last_name || !newGuestData.email || !newGuestData.id_document) {
        alert('Por favor completa todos los datos obligatorios del nuevo huésped.');
        return;
      }
      const createdGuest = await addGuest(newGuestData);
      finalGuestId = createdGuest.id;
    }

    const totalPrice = calculateTotal();

    await addBooking({
      room_id: roomId,
      guest_id: finalGuestId,
      check_in: checkIn,
      check_out: checkOut,
      status,
      total_price: totalPrice,
      special_requests: specialRequests || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="glass-panel border border-slate-800 bg-slate-950 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="font-serif-luxury text-xl font-bold text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>Nueva Reserva Hotel Riss</span>
            </h2>
            <p className="text-xs text-slate-400">Asigna habitación, fechas y huésped al planning.</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Room Selection */}
          <div>
            <label className="text-slate-300 font-semibold flex items-center space-x-1.5 mb-1.5">
              <Bed className="w-3.5 h-3.5 text-amber-400" />
              <span>Habitación a reservar (20 disponibles) *</span>
            </label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-amber-500"
            >
              <optgroup label="Planta 1 — Twin / Doble Individual">
                {rooms.filter(r => r.floor === 1).map(r => (
                  <option key={r.id} value={r.id}>
                    Hab #{r.room_number} — Twin ({r.price_per_night}€/noche) [{r.status}]
                  </option>
                ))}
              </optgroup>
              <optgroup label="Planta 2 — Doble Matrimonio">
                {rooms.filter(r => r.floor === 2).map(r => (
                  <option key={r.id} value={r.id}>
                    Hab #{r.room_number} — Matrimonio ({r.price_per_night}€/noche) [{r.status}]
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Guest Selection or Quick Create */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Huésped Titular *</span>
              </label>

              <button
                type="button"
                onClick={() => setIsCreatingNewGuest(!isCreatingNewGuest)}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-medium underline"
              >
                {isCreatingNewGuest ? '← Seleccionar huésped existente' : '+ Registrar nuevo huésped'}
              </button>
            </div>

            {!isCreatingNewGuest ? (
              <select
                value={guestId}
                onChange={(e) => setGuestId(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                {guests.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.first_name} {g.last_name} — DNI: {g.id_document} ({g.email})
                  </option>
                ))}
              </select>
            ) : (
              <div className="space-y-2 pt-1 border-t border-slate-800">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Nombre *"
                    value={newGuestData.first_name}
                    onChange={(e) => setNewGuestData({ ...newGuestData, first_name: e.target.value })}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Apellidos *"
                    value={newGuestData.last_name}
                    onChange={(e) => setNewGuestData({ ...newGuestData, last_name: e.target.value })}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="DNI / Pasaporte *"
                    value={newGuestData.id_document}
                    onChange={(e) => setNewGuestData({ ...newGuestData, id_document: e.target.value })}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono-code"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email *"
                    value={newGuestData.email}
                    onChange={(e) => setNewGuestData({ ...newGuestData, email: e.target.value })}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Dates Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Entrada (Check-in) *</label>
              <input
                type="date"
                required
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono-code focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Salida (Check-out) *</label>
              <input
                type="date"
                required
                value={checkOut}
                min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono-code focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Status and Notes */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Estado de Reserva</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BookingStatus)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="confirmed">Confirmada</option>
                <option value="checked_in">Checked-In (En Hotel)</option>
                <option value="checked_out">Checked-Out</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Peticiones Especiales</label>
              <input
                type="text"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Ej. Cuna, botella cava..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Price Calculation Summary Box */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/30 to-slate-900 border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[11px]">Tarifa Estimada:</span>
              <span className="text-slate-200 font-medium">
                {selectedRoom?.price_per_night || 0}€ x {nightsCount()} noche{nightsCount() === 1 ? '' : 's'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[11px]">Total Reserva:</span>
              <span className="font-serif-luxury text-2xl font-bold text-amber-400">
                {calculateTotal()}€
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded-xl shadow-lg shadow-amber-500/20"
            >
              Confirmar Reserva
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
