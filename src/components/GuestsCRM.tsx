import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  FileText, 
  ChevronRight,
  X,
  History,
  Building
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import type { Guest } from '../types';

export const GuestsCRM: React.FC = () => {
  const { guests, bookings, rooms, addGuest, updateGuest } = useHotel();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGuestForHistory, setSelectedGuestForHistory] = useState<Guest | null>(null);

  // New / Edit Guest Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    id_document: '',
    country: 'España',
    notes: ''
  });

  // Filter guests
  const filteredGuests = guests.filter(g => {
    const q = searchQuery.toLowerCase();
    const fullName = `${g.first_name} ${g.last_name}`.toLowerCase();
    return (
      fullName.includes(q) ||
      g.email.toLowerCase().includes(q) ||
      g.id_document.toLowerCase().includes(q) ||
      (g.phone && g.phone.toLowerCase().includes(q))
    );
  });

  const handleOpenAdd = () => {
    setEditingGuestId(null);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      id_document: '',
      country: 'España',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (guest: Guest) => {
    setEditingGuestId(guest.id);
    setFormData({
      first_name: guest.first_name,
      last_name: guest.last_name,
      email: guest.email,
      phone: guest.phone || '',
      id_document: guest.id_document,
      country: guest.country || 'España',
      notes: guest.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.id_document) {
      alert('Por favor, completa los campos requeridos (*)');
      return;
    }

    if (editingGuestId) {
      await updateGuest(editingGuestId, formData);
    } else {
      await addGuest(formData);
    }
    setIsModalOpen(false);
  };

  // Get bookings history for a guest
  const getGuestBookings = (guestId: string) => {
    return bookings.filter(b => b.guest_id === guestId);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-white flex items-center space-x-2">
            <Users className="w-6 h-6 text-amber-400" />
            <span>Gestión de Clientes (CRM)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Fichero de huéspedes, documentación de identidad, historial de estancias y preferencias de habitación.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Registrar Nuevo Huésped</span>
        </button>
      </div>

      {/* Search and stats bar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, DNI, email o teléfono..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="text-xs text-slate-400 flex items-center space-x-4">
          <span>Huéspedes en base de datos: <strong className="text-white">{guests.length}</strong></span>
          <span>Resultados: <strong className="text-amber-400">{filteredGuests.length}</strong></span>
        </div>
      </div>

      {/* Guests Cards / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGuests.map((guest) => {
          const guestBookings = getGuestBookings(guest.id);

          return (
            <div
              key={guest.id}
              className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Guest Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif-luxury font-bold text-lg text-white">
                      {guest.first_name} {guest.last_name}
                    </h3>
                    <div className="flex items-center space-x-1.5 text-xs text-amber-400 mt-0.5">
                      <FileText className="w-3.5 h-3.5" />
                      <span className="font-mono-code">{guest.id_document}</span>
                    </div>
                  </div>

                  <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                    {guest.country || 'España'}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate text-slate-300">{guest.email}</span>
                  </div>
                  {guest.phone && (
                    <div className="flex items-center space-x-2 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{guest.phone}</span>
                    </div>
                  )}
                </div>

                {/* Notes & Preferences */}
                {guest.notes && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300">
                    <span className="text-amber-400 font-semibold block mb-0.5">Preferencias:</span>
                    <p className="line-clamp-2">{guest.notes}</p>
                  </div>
                )}
              </div>

              {/* Bottom Footer: Stays count and actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedGuestForHistory(guest)}
                  className="flex items-center space-x-1.5 text-amber-400 hover:text-amber-300 font-medium"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>{guestBookings.length} Estancia{guestBookings.length === 1 ? '' : 's'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleOpenEdit(guest)}
                  className="text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800"
                >
                  Editar
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Guest Stay History Modal */}
      {selectedGuestForHistory && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass-panel border border-slate-800 bg-slate-950 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-white">
                  Historial de Estancias
                </h3>
                <p className="text-xs text-amber-400">
                  {selectedGuestForHistory.first_name} {selectedGuestForHistory.last_name} • {selectedGuestForHistory.id_document}
                </p>
              </div>
              <button
                onClick={() => setSelectedGuestForHistory(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-3">
              {getGuestBookings(selectedGuestForHistory.id).length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">Este cliente aún no registra reservas completadas.</p>
              ) : (
                getGuestBookings(selectedGuestForHistory.id).map(b => {
                  const room = rooms.find(r => r.id === b.room_id);
                  return (
                    <div key={b.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center space-x-1.5">
                          <Building className="w-3.5 h-3.5 text-amber-400" />
                          <span>Habitación #{room?.room_number || '---'} ({room?.type === 'individual_doble' ? 'Twin' : 'Matrimonio'})</span>
                        </span>
                        <span className="font-mono-code font-bold text-amber-400">{b.total_price}€</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span>Entrada: {b.check_in}</span>
                        <span>Salida: {b.check_out}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px]">
                        <span className="uppercase font-semibold text-slate-300">Estado: {b.status}</span>
                        {b.special_requests && <span className="text-slate-400 truncate max-w-[200px]">Nota: {b.special_requests}</span>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="text-right pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedGuestForHistory(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-4 py-2 rounded-xl"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add / Edit Guest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass-panel border border-slate-800 bg-slate-950 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif-luxury text-lg font-bold text-white">
                {editingGuestId ? 'Editar Ficha de Huésped' : 'Registrar Nuevo Huésped'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Nombre *</label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    placeholder="Ej. Elena"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Apellidos *</label>
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    placeholder="Ej. Navarro García"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Documento Identidad / DNI *</label>
                  <input
                    type="text"
                    required
                    value={formData.id_document}
                    onChange={(e) => setFormData({ ...formData, id_document: e.target.value })}
                    placeholder="47891234A o Pasaporte"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono-code focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">País</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="España"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="cliente@ejemplo.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+34 600 000 000"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Notas y Preferencias</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Alergias, tipo de almohada, requerimientos de accesibilidad..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-5 py-2 rounded-xl shadow-md shadow-amber-500/20"
                >
                  {editingGuestId ? 'Guardar Cambios' : 'Registrar Huésped'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
