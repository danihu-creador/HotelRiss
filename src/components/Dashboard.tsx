import React from 'react';
import { 
  Bed, 
  DoorOpen, 
  CalendarCheck, 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  ArrowRightLeft
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import type { ActiveTab } from './Navbar';

interface DashboardProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenBookingModal: (roomId?: string) => void;
  onOpenStockModal: (itemId?: string, type?: 'in' | 'out') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  setActiveTab,
  onOpenBookingModal,
  onOpenStockModal
}) => {
  const { rooms, bookings, inventory, updateBookingStatus } = useHotel();

  const totalRooms = rooms.length || 20;
  const occupiedRooms = rooms.filter(r => r.status === 'ocupada').length;
  const availableRooms = rooms.filter(r => r.status === 'disponible').length;
  const cleaningRooms = rooms.filter(r => r.status === 'limpieza').length;
  const maintenanceRooms = rooms.filter(r => r.status === 'mantenimiento').length;

  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

  // Today's date YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  // Today's arrivals (check_in = today)
  const todayArrivals = bookings.filter(b => b.check_in === today && b.status !== 'cancelled');

  // Today's departures (check_out = today)
  const todayDepartures = bookings.filter(b => b.check_out === today && b.status !== 'cancelled');

  // Low stock items
  const lowStockItems = inventory.filter(i => i.quantity <= i.min_stock_alert);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/40 p-6 sm:p-8 border border-slate-800 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Panel Operativo en Tiempo Real</span>
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-wide">
              Bienvenido al Hotel Riss
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              20 habitaciones boutique de diseño. Monitoriza ocupación, gestiona el planning interactivo y controla suministros al instante.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onOpenBookingModal()}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2"
            >
              <span>+ Nueva Reserva</span>
            </button>
            <button
              onClick={() => setActiveTab('planning')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl font-medium text-sm border border-slate-700 transition-all flex items-center space-x-2"
            >
              <span>Ver Planning Grid</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* KPI 1: Occupancy */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Ocupación Actual</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white font-serif-luxury">{occupancyRate}%</span>
            <span className="text-xs text-slate-400 font-medium">({occupiedRooms} de {totalRooms} habs)</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500" 
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Available Rooms */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Habitaciones Libres</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DoorOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-emerald-400 font-serif-luxury">{availableRooms}</span>
            <span className="text-xs text-slate-400 font-medium">disponibles hoy</span>
          </div>
          <div className="mt-3 flex items-center space-x-2 text-[11px] text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
            <span>{cleaningRooms} Limpieza</span>
            <span className="inline-block w-2 h-2 rounded-full bg-rose-400 ml-2"></span>
            <span>{maintenanceRooms} Mantenimiento</span>
          </div>
        </div>

        {/* KPI 3: Today Arrivals & Departures */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Llegadas de Hoy</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white font-serif-luxury">{todayArrivals.length}</span>
            <span className="text-xs text-slate-400 font-medium">check-ins</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Salidas (Check-outs): <strong className="text-slate-200">{todayDepartures.length}</strong></span>
            <button 
              onClick={() => setActiveTab('planning')}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Ver agenda
            </button>
          </div>
        </div>

        {/* KPI 4: Low Stock Alerts */}
        <div className={`glass-panel p-5 rounded-2xl relative overflow-hidden group transition-all ${
          lowStockItems.length > 0 ? 'border-rose-500/30 hover:border-rose-500/60' : 'hover:border-slate-700'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Alertas de Stock</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              lowStockItems.length > 0 ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400' : 'bg-slate-800 text-slate-400'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className={`text-3xl font-bold font-serif-luxury ${lowStockItems.length > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
              {lowStockItems.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">productos críticos</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400">Bajo nivel mínimo</span>
            <button 
              onClick={() => setActiveTab('inventory')}
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              Gestionar
            </button>
          </div>
        </div>

      </div>

      {/* Grid: 20 Rooms Status Overview & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 20 Rooms Visual Status Grid (2 Columns) */}
        <div className="lg:col-span-2 glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif-luxury text-lg font-bold text-white flex items-center space-x-2">
                <Bed className="w-5 h-5 text-amber-400" />
                <span>Estado de las 20 Habitaciones</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Planta 1 (101-110 Twin) • Planta 2 (201-210 Matrimonio)
              </p>
            </div>
            
            {/* Status Legend */}
            <div className="hidden sm:flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span className="text-slate-300">Libre</span></span>
              <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span><span className="text-slate-300">Ocupada</span></span>
              <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span className="text-slate-300">Limpieza</span></span>
              <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span><span className="text-slate-300">Mantenimiento</span></span>
            </div>
          </div>

          {/* Rooms Grid 5x4 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {rooms.map((room) => {
              const statusColors = {
                disponible: 'border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-500 text-emerald-300',
                ocupada: 'border-blue-500/40 bg-blue-950/20 hover:border-blue-500 text-blue-300',
                limpieza: 'border-amber-500/40 bg-amber-950/20 hover:border-amber-500 text-amber-300',
                mantenimiento: 'border-rose-500/40 bg-rose-950/20 hover:border-rose-500 text-rose-300'
              };

              const badgeColors = {
                disponible: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                ocupada: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                limpieza: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                mantenimiento: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              };

              return (
                <div
                  key={room.id}
                  onClick={() => {
                    if (room.status === 'disponible') {
                      onOpenBookingModal(room.id);
                    } else {
                      setActiveTab('rooms');
                    }
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer group ${statusColors[room.status]}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base text-white group-hover:text-amber-400 transition-colors">
                      #{room.room_number}
                    </span>
                    <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-semibold border ${badgeColors[room.status]}`}>
                      {room.status.substring(0, 4)}
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-400 truncate">
                    {room.type === 'individual_doble' ? 'Twin / Doble' : 'Matrimonio'}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono-code">{room.price_per_night}€</span>
                    <span className="text-[10px] text-slate-500">P{room.floor}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Haz clic en una habitación disponible para reservar o cambiar su estado.</span>
            <button
              onClick={() => setActiveTab('rooms')}
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              Ver todas las habitaciones →
            </button>
          </div>
        </div>

        {/* Right Column: Arrivals & Low Stock Alerts */}
        <div className="space-y-6">
          
          {/* Today's Arrivals Widget */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif-luxury text-sm font-bold text-white flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Llegadas Hoy ({todayArrivals.length})</span>
              </h3>
              <span className="text-[11px] text-slate-400">{today}</span>
            </div>

            {todayArrivals.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">No hay más llegadas programadas para hoy.</p>
            ) : (
              <div className="space-y-2.5">
                {todayArrivals.map((booking) => {
                  const guest = booking.guest;
                  const room = rooms.find(r => r.id === booking.room_id);
                  const isCheckedIn = booking.status === 'checked_in';

                  return (
                    <div key={booking.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-semibold text-xs text-white">
                            {guest ? `${guest.first_name} ${guest.last_name}` : 'Huésped'}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 font-mono-code font-bold">
                            Hab #{room?.room_number}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Hasta {booking.check_out} • {booking.total_price}€
                        </div>
                      </div>

                      {isCheckedIn ? (
                        <span className="flex items-center space-x-1 text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded-md border border-emerald-800/40">
                          <CheckCircle className="w-3 h-3" />
                          <span>En hotel</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'checked_in')}
                          className="text-[11px] bg-blue-600 hover:bg-blue-500 text-white font-medium px-2.5 py-1 rounded-md transition-colors"
                        >
                          Check-in
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Urgent Stock Alerts Widget */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif-luxury text-sm font-bold text-white flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Stock Bajo Mínimo</span>
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                {lowStockItems.length} alertas
              </span>
            </div>

            {lowStockItems.length === 0 ? (
              <p className="text-xs text-emerald-400 py-3 text-center flex items-center justify-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Todo el inventario está en niveles óptimos.</span>
              </p>
            ) : (
              <div className="space-y-2">
                {lowStockItems.slice(0, 4).map((item) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-rose-900/30 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white truncate max-w-[150px]">
                        {item.item_name}
                      </div>
                      <div className="text-[10px] text-rose-400 font-mono-code">
                        Stock: {item.quantity} {item.unit} (Mín: {item.min_stock_alert})
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenStockModal(item.id, 'in')}
                      className="text-[11px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-1 rounded-md transition-colors flex items-center space-x-1"
                    >
                      <ArrowRightLeft className="w-3 h-3" />
                      <span>Reponer</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 pt-2 border-t border-slate-800/80 text-right">
              <button
                onClick={() => setActiveTab('inventory')}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium"
              >
                Abrir inventario completo →
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
