import { useState } from 'react';
import { HotelProvider } from './context/HotelContext';
import { Navbar, type ActiveTab } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { CalendarPlanning } from './components/CalendarPlanning';
import { RoomsView } from './components/RoomsView';
import { GuestsCRM } from './components/GuestsCRM';
import { InventoryView } from './components/InventoryView';
import { BookingModal } from './components/BookingModal';
import { StockMovementModal } from './components/StockMovementModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';

function MainApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingRoomId, setBookingRoomId] = useState<string | undefined>(undefined);
  const [bookingDate, setBookingDate] = useState<string | undefined>(undefined);

  // Stock Movement Modal State
  const [isStockModalOpen, setIsStockModalOpen] = useState<boolean>(false);
  const [stockItemId, setStockItemId] = useState<string | undefined>(undefined);
  const [stockType, setStockType] = useState<'in' | 'out' | undefined>(undefined);

  // Supabase Config Modal State
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);

  const handleOpenBooking = (roomId?: string, date?: string) => {
    setBookingRoomId(roomId);
    setBookingDate(date);
    setIsBookingModalOpen(true);
  };

  const handleOpenStock = (itemId?: string, type?: 'in' | 'out') => {
    setStockItemId(itemId);
    setStockType(type);
    setIsStockModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBookingModal={() => handleOpenBooking()}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            setActiveTab={setActiveTab}
            onOpenBookingModal={handleOpenBooking}
            onOpenStockModal={handleOpenStock}
          />
        )}

        {activeTab === 'planning' && (
          <CalendarPlanning
            onOpenBookingModal={handleOpenBooking}
          />
        )}

        {activeTab === 'rooms' && (
          <RoomsView
            onOpenBookingModal={handleOpenBooking}
          />
        )}

        {activeTab === 'guests' && (
          <GuestsCRM />
        )}

        {activeTab === 'inventory' && (
          <InventoryView
            onOpenStockModal={handleOpenStock}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-serif-luxury text-sm font-bold text-slate-300">HOTEL RISS</span>
            <span>•</span>
            <span>Sistema Integral de Gestión Boutique</span>
          </div>
          <div>
            <span>PostgreSQL &amp; Supabase Ready</span>
            <span className="mx-2">•</span>
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="text-amber-400 hover:text-amber-300 underline"
            >
              Conexión Supabase
            </button>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        defaultRoomId={bookingRoomId}
        defaultDate={bookingDate}
      />

      <StockMovementModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        defaultItemId={stockItemId}
        defaultType={stockType}
      />

      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <HotelProvider>
      <MainApp />
    </HotelProvider>
  );
}
