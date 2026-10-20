import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Filter, 
  Plus, 
  Info,
  User,
  X,
  Trash2
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import type { Booking, BookingStatus } from '../types';

interface CalendarPlanningProps {
  onOpenBookingModal: (roomId?: string, defaultDate?: string) => void;
}

export const CalendarPlanning: React.FC<CalendarPlanningProps> = ({ onOpenBookingModal }) => {
  const { rooms, bookings, updateBookingStatus, deleteBooking } = useHotel();

  // Calendar view settings
  const [viewDaysCount, setViewDaysCount] = useState<number>(14); // 7, 14, 21
  const [startDate, setStartDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Filters
  const [filterType, setFilterType] = useState<string>('all');
  const [filterFloor, setFilterFloor] = useState<string>('all');

  // Selected Booking Drawer/Modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Generate date array
  const dateList = useMemo(() => {
    const list: Date[] = [];
    for (let i = 0; i < viewDaysCount; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      list.push(d);
    }
    return list;
  }, [startDate, viewDaysCount]);

  // Format date helper: YYYY-MM-DD
  const formatYMD = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const todayStr = useMemo(() => formatYMD(new Date()), []);

  // Filter rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter(r => {
      if (filterType !== 'all' && r.type !== filterType) return false;
      if (filterFloor !== 'all' && r.floor.toString() !== filterFloor) return false;
      return true;
    });
  }, [rooms, filterType, filterFloor]);

  // Navigation handlers
  const handlePrev = () => {
    const d = new Date(startDate);
    d.setDate(d.getDate() - 7);
    setStartDate(d);
  };

  const handleNext = () => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + 7);
    setStartDate(d);
  };

  const handleToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setStartDate(d);
  };

  // Find booking for a specific room and date
  const getBookingForCell = (roomId: string, dateStr: string): Booking | undefined => {
    return bookings.find(b => {
      if (b.room_id !== roomId || b.status === 'cancelled') return false;
      // booking spans from check_in to check_out (exclusive or inclusive)
      return dateStr >= b.check_in && dateStr < b.check_out;
    });
  };

  // Status badges & colors
  const getBookingColor = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-indigo-600/80 hover:bg-indigo-500 border-indigo-400/50 text-indigo-100';
      case 'checked_in':
        return 'bg-emerald-600/80 hover:bg-emerald-500 border-emerald-400/50 text-emerald-100';
      case 'checked_out':
        return 'bg-slate-700/80 hover:bg-slate-600 border-slate-500/50 text-slate-300';
      case 'cancelled':
        return 'bg-rose-900/60 border-rose-700/50 text-rose-300 line-through';
      default:
        return 'bg-amber-600 border-amber-400 text-white';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header & Controls */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-white flex items-center space-x-2">
            <CalendarIcon className="w-6 h-6 text-amber-400" />
            <span>Planning Interactivo de Reservas</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Matriz de disponibilidad de las 20 habitaciones. Haz clic en cualquier casilla para reservar o gestionar estancias.
          </p>
        </div>

        {/* View Controls & Date Pickers */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          {/* View Days selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex items-center space-x-1 text-xs">
            <button
              onClick={() => setViewDaysCount(7)}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                viewDaysCount === 7 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              7 Días
            </button>
            <button
              onClick={() => setViewDaysCount(14)}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                viewDaysCount === 14 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              14 Días
            </button>
            <button
              onClick={() => setViewDaysCount(21)}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                viewDaysCount === 21 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              21 Días
            </button>
          </div>

          {/* Date navigation */}
          <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={handlePrev}
              title="Semana anterior"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Hoy
            </button>
            <button
              onClick={handleNext}
              title="Semana siguiente"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Create Button */}
          <button
            onClick={() => onOpenBookingModal()}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Reservar</span>
          </button>
        </div>
      </div>

      {/* Filters Bar & Color Legend */}
      <div className="glass-panel px-4 py-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5 text-slate-400">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium">Filtrar:</span>
          </div>

          {/* Room Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Todos los Tipos (20)</option>
            <option value="individual_doble">Twin / Individual Doble (10)</option>
            <option value="matrimonio">Doble Matrimonio (10)</option>
          </select>

          {/* Floor */}
          <select
            value={filterFloor}
            onChange={(e) => setFilterFloor(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Todas las Plantas</option>
            <option value="1">Planta 1 (Habs 101-110)</option>
            <option value="2">Planta 2 (Habs 201-210)</option>
          </select>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-slate-400">
          <span className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded bg-indigo-600 inline-block"></span>
            <span>Confirmada</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded bg-emerald-600 inline-block"></span>
            <span>Checked-In</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded bg-slate-700 inline-block"></span>
            <span>Checked-Out</span>
          </span>
        </div>
      </div>

      {/* Main Interactive Planning Grid */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[900px]">
            
            {/* Table Header: Days of the period */}
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800">
                {/* Fixed Room column */}
                <th className="sticky left-0 z-20 bg-slate-900 px-4 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider w-48 border-r border-slate-800 shadow-md">
                  Habitación ({filteredRooms.length})
                </th>

                {/* Day Headers */}
                {dateList.map((d) => {
                  const ymd = formatYMD(d);
                  const isToday = ymd === todayStr;
                  const dayOfWeek = d.toLocaleDateString('es-ES', { weekday: 'short' });
                  const dayNum = d.getDate();
                  const monthName = d.toLocaleDateString('es-ES', { month: 'short' });

                  return (
                    <th
                      key={ymd}
                      className={`px-2 py-2 text-center border-r border-slate-800/60 min-w-[70px] ${
                        isToday ? 'bg-amber-500/10 border-amber-500/30' : ''
                      }`}
                    >
                      <div className="text-[10px] text-slate-400 uppercase font-medium">{dayOfWeek}</div>
                      <div className={`text-sm font-bold mt-0.5 ${isToday ? 'text-amber-400 font-extrabold' : 'text-slate-200'}`}>
                        {dayNum}
                      </div>
                      <div className="text-[9px] text-slate-500">{monthName}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Table Body: 20 Rooms rows */}
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredRooms.map((room) => {
                const roomTypeLabel = room.type === 'individual_doble' ? 'Twin' : 'Matrimonio';

                return (
                  <tr key={room.id} className="hover:bg-slate-850/40 transition-colors group">
                    
                    {/* Sticky Room Info Cell */}
                    <td className="sticky left-0 z-10 bg-slate-950 px-4 py-2.5 border-r border-slate-800 group-hover:bg-slate-900 transition-colors shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-white font-mono-code group-hover:text-amber-400 transition-colors">
                            #{room.room_number}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                            {roomTypeLabel}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono-code">
                          {room.price_per_night}€
                        </span>
                      </div>
                    </td>

                    {/* Day Cells for this room */}
                    {dateList.map((d) => {
                      const ymd = formatYMD(d);
                      const isToday = ymd === todayStr;
                      const booking = getBookingForCell(room.id, ymd);

                      // Check if this date is the check-in start
                      const isStartOfBooking = booking && booking.check_in === ymd;

                      return (
                        <td
                          key={ymd}
                          className={`p-1 border-r border-slate-800/60 h-14 relative ${
                            isToday ? 'bg-amber-500/5' : ''
                          }`}
                        >
                          {booking ? (
                            <div
                              onClick={() => setSelectedBooking(booking)}
                              className={`h-full w-full rounded-md p-1.5 border text-[11px] font-medium flex flex-col justify-between cursor-pointer shadow-sm transition-all transform hover:scale-[1.02] ${getBookingColor(booking.status)}`}
                              title={`Reserva #${booking.id} - ${booking.guest?.first_name || 'Huésped'} - ${booking.status}`}
                            >
                              <div className="font-semibold truncate leading-tight flex items-center space-x-1">
                                <User className="w-2.5 h-2.5 shrink-0" />
                                <span className="truncate">
                                  {booking.guest ? `${booking.guest.first_name} ${booking.guest.last_name.split(' ')[0]}` : 'Reserva'}
                                </span>
                              </div>
                              <div className="text-[9px] opacity-80 flex items-center justify-between">
                                <span>{isStartOfBooking ? 'Check-in' : ''}</span>
                                <span>{booking.total_price}€</span>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => onOpenBookingModal(room.id, ymd)}
                              className="w-full h-full rounded-md border border-dashed border-transparent hover:border-amber-500/40 hover:bg-amber-500/10 flex items-center justify-center text-transparent hover:text-amber-400 transition-all text-xs font-semibold"
                              title={`Crear reserva para Habitación #${room.room_number} el ${ymd}`}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      );
                    })}

                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-900/60 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-amber-400" />
            <span>Haz clic en cualquier bloque de reserva para ver detalles o cambiar estado a Check-in/Check-out.</span>
          </div>
          <span>Mostrando {filteredRooms.length} habitaciones</span>
        </div>
      </div>

      {/* Booking Details Modal / Drawer */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass-panel border border-slate-800 bg-slate-950 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-white">Detalle de Reserva</h3>
                <span className="text-xs text-slate-400 font-mono-code">ID: {selectedBooking.id}</span>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400">Huésped</div>
                <div className="font-bold text-base text-white mt-0.5">
                  {selectedBooking.guest ? `${selectedBooking.guest.first_name} ${selectedBooking.guest.last_name}` : 'Sin datos'}
                </div>
                {selectedBooking.guest && (
                  <div className="text-xs text-slate-400 mt-1 space-y-0.5">
                    <div>Email: <span className="text-slate-200">{selectedBooking.guest.email}</span></div>
                    <div>Doc / DNI: <span className="text-slate-200">{selectedBooking.guest.id_document}</span></div>
                    {selectedBooking.guest.phone && <div>Teléfono: <span className="text-slate-200">{selectedBooking.guest.phone}</span></div>}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">Habitación</div>
                  <div className="font-bold text-white text-base mt-0.5">
                    #{rooms.find(r => r.id === selectedBooking.room_id)?.room_number || '---'}
                  </div>
                  <div className="text-xs text-slate-400">
                    {rooms.find(r => r.id === selectedBooking.room_id)?.type === 'individual_doble' ? 'Twin' : 'Matrimonio'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">Importe Total</div>
                  <div className="font-bold text-amber-400 text-lg font-mono-code mt-0.5">
                    {selectedBooking.total_price}€
                  </div>
                  <div className="text-[11px] text-slate-500">Impuestos incl.</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="text-slate-400">Entrada (Check-in)</div>
                  <div className="font-semibold text-white mt-0.5">{selectedBooking.check_in}</div>
                </div>
                <div className="text-slate-500 font-mono-code">➔</div>
                <div>
                  <div className="text-slate-400">Salida (Check-out)</div>
                  <div className="font-semibold text-white mt-0.5">{selectedBooking.check_out}</div>
                </div>
              </div>

              {selectedBooking.special_requests && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                  <div className="font-semibold text-amber-300">Peticiones Especiales:</div>
                  <div className="text-slate-300 mt-1">{selectedBooking.special_requests}</div>
                </div>
              )}

              {/* Status Change Selector */}
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Estado de la Reserva:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      updateBookingStatus(selectedBooking.id, 'checked_in');
                      setSelectedBooking(prev => prev ? { ...prev, status: 'checked_in' } : null);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      selectedBooking.status === 'checked_in'
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                        : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-emerald-500'
                    }`}
                  >
                    ✓ Checked-In
                  </button>
                  <button
                    onClick={() => {
                      updateBookingStatus(selectedBooking.id, 'checked_out');
                      setSelectedBooking(prev => prev ? { ...prev, status: 'checked_out' } : null);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      selectedBooking.status === 'checked_out'
                        ? 'bg-slate-700 text-white'
                        : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    ➜ Checked-Out
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  if (confirm('¿Eliminar esta reserva permanentemente?')) {
                    deleteBooking(selectedBooking.id);
                    setSelectedBooking(null);
                  }
                }}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1 p-2 rounded-lg hover:bg-rose-950/30"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Cancelar / Borrar</span>
              </button>

              <button
                onClick={() => setSelectedBooking(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium px-4 py-2 rounded-xl"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
