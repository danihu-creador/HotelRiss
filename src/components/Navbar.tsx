import React from 'react';
import { 
  Building2, 
  CalendarDays, 
  Users, 
  Package, 
  LayoutDashboard, 
  BedDouble, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';

export type ActiveTab = 'dashboard' | 'planning' | 'rooms' | 'guests' | 'inventory';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenBookingModal: () => void;
  onOpenSupabaseModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenBookingModal,
  onOpenSupabaseModal
}) => {
  const { isLiveSupabase, inventory } = useHotel();

  // Count low stock items for badge
  const lowStockCount = inventory.filter(i => i.quantity <= i.min_stock_alert).length;

  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'planning' as ActiveTab, label: 'Planning Reservas', icon: CalendarDays },
    { id: 'rooms' as ActiveTab, label: 'Habitaciones (20)', icon: BedDouble },
    { id: 'guests' as ActiveTab, label: 'CRM Huéspedes', icon: Users },
    { 
      id: 'inventory' as ActiveTab, 
      label: 'Inventario', 
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : undefined
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Boutique Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Building2 className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-wider text-white">HOTEL RISS</span>
                <span className="text-[10px] tracking-widest uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                  Boutique
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">20 Habitaciones Exclusivas • PMS Integral</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-slate-900/70 p-1.5 rounded-xl border border-slate-800/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-slate-950 text-amber-400' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions & Connection Status */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Supabase status indicator */}
            <button
              onClick={onOpenSupabaseModal}
              title="Configuración de conexión Supabase"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isLiveSupabase
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60 hover:bg-emerald-900/50'
                  : 'bg-amber-950/30 text-amber-400 border-amber-800/40 hover:bg-amber-900/40'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              {isLiveSupabase ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="hidden sm:inline">Supabase Live</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                  <span className="hidden sm:inline">Supabase Setup</span>
                </>
              )}
            </button>

            {/* Quick New Booking Button */}
            <button
              onClick={onOpenBookingModal}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden xs:inline">Nueva Reserva</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/60 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center px-2 py-1 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className="w-4 h-4 mb-0.5" />
                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
