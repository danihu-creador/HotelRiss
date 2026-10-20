import React, { useState } from 'react';
import { 
  BedDouble, 
  Sparkles, 
  Wrench, 
  CheckCircle, 
  DoorClosed, 
  Filter, 
  Edit3, 
  Check, 
  X,
  Layers
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import type { Room, RoomStatus } from '../types';

interface RoomsViewProps {
  onOpenBookingModal: (roomId?: string) => void;
}

export const RoomsView: React.FC<RoomsViewProps> = ({ onOpenBookingModal }) => {
  const { rooms, updateRoomStatus, updateRoomPrice } = useHotel();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [floorFilter, setFloorFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Editing price state
  const [editingPriceRoomId, setEditingPriceRoomId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  const filteredRooms = rooms.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (floorFilter !== 'all' && r.floor.toString() !== floorFilter) return false;
    if (typeFilter !== 'all' && r.type !== typeFilter) return false;
    return true;
  });

  const handleStartEditPrice = (room: Room) => {
    setEditingPriceRoomId(room.id);
    setTempPrice(room.price_per_night);
  };

  const handleSavePrice = async (roomId: string) => {
    if (tempPrice > 0) {
      await updateRoomPrice(roomId, tempPrice);
    }
    setEditingPriceRoomId(null);
  };

  const getStatusBadge = (status: RoomStatus) => {
    switch (status) {
      case 'disponible':
        return { label: 'Disponible', class: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: CheckCircle };
      case 'ocupada':
        return { label: 'Ocupada', class: 'bg-blue-500/15 text-blue-300 border-blue-500/30', icon: DoorClosed };
      case 'limpieza':
        return { label: 'Limpieza', class: 'bg-amber-500/15 text-amber-300 border-amber-500/30', icon: Sparkles };
      case 'mantenimiento':
        return { label: 'Mantenimiento', class: 'bg-rose-500/15 text-rose-300 border-rose-500/30', icon: Wrench };
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-white flex items-center space-x-2">
            <BedDouble className="w-6 h-6 text-amber-400" />
            <span>Gestión de las 20 Habitaciones</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Control de gobernanza, estados de limpieza y tarifas de las 20 habitaciones boutique.
          </p>
        </div>

        {/* Counts summary pill */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-xs">
          <Layers className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300">
            Total: <strong className="text-white">20</strong> (10 Twin • 10 Matrimonio)
          </span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center space-x-1.5 text-slate-400">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-medium">Filtros:</span>
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
        >
          <option value="all">Todos los Estados</option>
          <option value="disponible">Disponibles</option>
          <option value="ocupada">Ocupadas</option>
          <option value="limpieza">En Limpieza</option>
          <option value="mantenimiento">En Mantenimiento</option>
        </select>

        {/* Type filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
        >
          <option value="all">Todos los Tipos</option>
          <option value="individual_doble">Twin / Doble Individual (10)</option>
          <option value="matrimonio">Doble Matrimonio (10)</option>
        </select>

        {/* Floor filter */}
        <select
          value={floorFilter}
          onChange={(e) => setFloorFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
        >
          <option value="all">Todas las Plantas</option>
          <option value="1">Planta 1</option>
          <option value="2">Planta 2</option>
        </select>

        <span className="text-slate-500 ml-auto hidden sm:inline">
          Mostrando {filteredRooms.length} habitaciones
        </span>
      </div>

      {/* 20 Rooms Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredRooms.map((room) => {
          const badge = getStatusBadge(room.status);
          const BadgeIcon = badge.icon;
          const isTwin = room.type === 'individual_doble';

          return (
            <div
              key={room.id}
              className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Card Top: Room Number & Status */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-serif-luxury text-2xl font-bold text-white tracking-wide">
                      #{room.room_number}
                    </span>
                    <span className="text-xs text-slate-400 ml-2">Planta {room.floor}</span>
                  </div>

                  <span className={`flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${badge.class}`}>
                    <BadgeIcon className="w-3 h-3" />
                    <span>{badge.label}</span>
                  </span>
                </div>

                {/* Room Type Label */}
                <div className="mt-2 text-xs font-medium text-amber-400/90 uppercase tracking-wider">
                  {isTwin ? 'Twin / Doble Individual' : 'Doble Matrimonio'}
                </div>

                {/* Price section with inline edit */}
                <div className="mt-3 flex items-center justify-between py-2 border-y border-slate-800/80">
                  <span className="text-xs text-slate-400">Precio / Noche:</span>
                  {editingPriceRoomId === room.id ? (
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        value={tempPrice}
                        onChange={(e) => setTempPrice(Number(e.target.value))}
                        className="w-16 bg-slate-900 border border-amber-500 text-white font-mono-code text-xs px-1.5 py-0.5 rounded focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSavePrice(room.id)}
                        className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-500"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setEditingPriceRoomId(null)}
                        className="p-1 rounded bg-slate-700 text-white hover:bg-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-white font-mono-code text-sm">
                        {room.price_per_night}€
                      </span>
                      <button
                        onClick={() => handleStartEditPrice(room)}
                        className="text-slate-500 hover:text-amber-400 p-0.5"
                        title="Modificar precio"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Amenities pills */}
                {room.amenities && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {room.amenities.slice(0, 3).map((a, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-900/80 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                        {a}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="text-[10px] text-slate-500 py-0.5">+{room.amenities.length - 3}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Actions: Quick Status Changer & Book */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="text-[11px] text-slate-400 font-medium">Cambiar estado gobernanta:</div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => updateRoomStatus(room.id, 'disponible')}
                    disabled={room.status === 'disponible'}
                    className={`text-[11px] py-1 rounded-lg font-medium transition-colors ${
                      room.status === 'disponible'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-semibold'
                        : 'bg-slate-900 text-slate-300 hover:bg-emerald-950/40 hover:text-emerald-300'
                    }`}
                  >
                    Libre
                  </button>
                  <button
                    onClick={() => updateRoomStatus(room.id, 'limpieza')}
                    disabled={room.status === 'limpieza'}
                    className={`text-[11px] py-1 rounded-lg font-medium transition-colors ${
                      room.status === 'limpieza'
                        ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60 font-semibold'
                        : 'bg-slate-900 text-slate-300 hover:bg-amber-950/40 hover:text-amber-300'
                    }`}
                  >
                    Limpieza
                  </button>
                  <button
                    onClick={() => updateRoomStatus(room.id, 'ocupada')}
                    disabled={room.status === 'ocupada'}
                    className={`text-[11px] py-1 rounded-lg font-medium transition-colors ${
                      room.status === 'ocupada'
                        ? 'bg-blue-950/60 text-blue-400 border border-blue-800/60 font-semibold'
                        : 'bg-slate-900 text-slate-300 hover:bg-blue-950/40 hover:text-blue-300'
                    }`}
                  >
                    Ocupada
                  </button>
                  <button
                    onClick={() => updateRoomStatus(room.id, 'mantenimiento')}
                    disabled={room.status === 'mantenimiento'}
                    className={`text-[11px] py-1 rounded-lg font-medium transition-colors ${
                      room.status === 'mantenimiento'
                        ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60 font-semibold'
                        : 'bg-slate-900 text-slate-300 hover:bg-rose-950/40 hover:text-rose-300'
                    }`}
                  >
                    Mantenimiento
                  </button>
                </div>

                {room.status === 'disponible' && (
                  <button
                    onClick={() => onOpenBookingModal(room.id)}
                    className="w-full mt-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold py-1.5 rounded-lg transition-colors"
                  >
                    + Asignar Reserva
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
