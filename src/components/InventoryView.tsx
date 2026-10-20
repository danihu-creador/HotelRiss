import React, { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Minus, 
  History, 
  ArrowDownRight, 
  ArrowUpRight, 
  Filter, 
  Search, 
  CheckCircle2, 
  Layers,
  X,
  PackagePlus
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import type { InventoryCategory } from '../types';

interface InventoryViewProps {
  onOpenStockModal: (itemId?: string, type?: 'in' | 'out') => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ onOpenStockModal }) => {
  const { inventory, inventoryLogs, addInventoryItem } = useHotel();

  const [activeTab, setActiveTab] = useState<'stock' | 'logs'>('stock');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // New Item Modal
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState<boolean>(false);
  const [newItemForm, setNewItemForm] = useState<{
    item_name: string;
    category: InventoryCategory;
    quantity: number;
    min_stock_alert: number;
    unit: string;
  }>({
    item_name: '',
    category: 'amenities',
    quantity: 10,
    min_stock_alert: 5,
    unit: 'uds'
  });

  // Filter inventory
  const filteredInventory = inventory.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery && !item.item_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const lowStockItems = inventory.filter(i => i.quantity <= i.min_stock_alert);

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemForm.item_name) return;
    await addInventoryItem(newItemForm);
    setIsNewItemModalOpen(false);
    setNewItemForm({
      item_name: '',
      category: 'amenities',
      quantity: 10,
      min_stock_alert: 5,
      unit: 'uds'
    });
  };

  const getCategoryLabel = (category: InventoryCategory) => {
    switch (category) {
      case 'limpieza': return 'Lencería y Limpieza';
      case 'minibar': return 'Minibar y Bebidas';
      case 'amenities': return 'Amenities y Baño';
      case 'mantenimiento': return 'Mantenimiento';
    }
  };

  const getCategoryColor = (category: InventoryCategory) => {
    switch (category) {
      case 'limpieza': return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'minibar': return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'amenities': return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'mantenimiento': return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-white flex items-center space-x-2">
            <Package className="w-6 h-6 text-amber-400" />
            <span>Control de Stock e Inventario</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestión en tiempo real de lencería, amenities boutique, suministros de minibar y repuestos técnicos.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onOpenStockModal(undefined, 'in')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Movimiento Rápido</span>
          </button>

          <button
            onClick={() => setIsNewItemModalOpen(true)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 border border-slate-700"
          >
            <PackagePlus className="w-3.5 h-3.5" />
            <span>Nuevo Artículo</span>
          </button>
        </div>
      </div>

      {/* Critical Stock Alert Banner (if any) */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-rose-200">
                Atención: Hay {lowStockItems.length} artículos por debajo del umbral mínimo de seguridad.
              </span>
              <p className="text-rose-300/80 text-[11px] mt-0.5">
                {lowStockItems.map(i => `${i.item_name} (${i.quantity} ${i.unit})`).join(' • ')}
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenStockModal(lowStockItems[0]?.id, 'in')}
            className="bg-rose-600 hover:bg-rose-500 text-white font-semibold px-3 py-1.5 rounded-lg shrink-0 self-start sm:self-auto text-xs"
          >
            Reponer {lowStockItems[0]?.item_name.substring(0, 16)}...
          </button>
        </div>
      )}

      {/* View Switcher Tabs (Stock vs Movement Log) */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
              activeTab === 'stock'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Artículos en Stock ({inventory.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
              activeTab === 'logs'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Historial de Movimientos ({inventoryLogs.length})</span>
          </button>
        </div>

        {activeTab === 'stock' && (
          <div className="text-xs text-slate-400 hidden sm:block">
            {lowStockItems.length} alertas activas
          </div>
        )}
      </div>

      {activeTab === 'stock' ? (
        <>
          {/* Filters & Search */}
          <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-medium flex items-center space-x-1">
                <Filter className="w-3.5 h-3.5 text-amber-400" />
                <span>Categoría:</span>
              </span>
              {(['all', 'limpieza', 'minibar', 'amenities', 'mantenimiento'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat === 'all' ? 'Todas' : cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar artículo..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Stock Table */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Artículo</th>
                    <th className="px-4 py-3.5">Categoría</th>
                    <th className="px-4 py-3.5 text-center">Nivel de Stock</th>
                    <th className="px-4 py-3.5 text-center">Alerta Mínima</th>
                    <th className="px-4 py-3.5 text-center">Estado</th>
                    <th className="px-5 py-3.5 text-right">Acciones de Ajuste</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredInventory.map(item => {
                    const isLow = item.quantity <= item.min_stock_alert;

                    return (
                      <tr key={item.id} className="hover:bg-slate-850/40 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-white">
                          <div className="text-sm font-semibold">{item.item_name}</div>
                          <div className="text-[10px] text-slate-500 font-mono-code">ID: {item.id}</div>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium border ${getCategoryColor(item.category)}`}>
                            {getCategoryLabel(item.category)}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          <span className={`text-base font-bold font-mono-code ${isLow ? 'text-rose-400' : 'text-slate-100'}`}>
                            {item.quantity}
                          </span>
                          <span className="text-[11px] text-slate-400 ml-1">{item.unit}</span>
                        </td>

                        <td className="px-4 py-3.5 text-center text-slate-400 font-mono-code">
                          {item.min_stock_alert} {item.unit}
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          {isLow ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Bajo Mínimo</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Óptimo</span>
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-3.5 text-right">
                          <div className="inline-flex items-center space-x-1.5">
                            {/* Fast Out (Gasto) */}
                            <button
                              onClick={() => onOpenStockModal(item.id, 'out')}
                              title="Registrar consumo / salida de stock"
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-800 transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>

                            {/* Fast In (Reposición) */}
                            <button
                              onClick={() => onOpenStockModal(item.id, 'in')}
                              title="Registrar entrada de mercancía / reposición"
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-emerald-950/40 text-slate-400 hover:text-emerald-400 border border-slate-800 hover:border-emerald-800 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Inventory Logs Table */
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Fecha y Hora</th>
                  <th className="px-4 py-3.5">Artículo</th>
                  <th className="px-4 py-3.5">Tipo</th>
                  <th className="px-4 py-3.5">Cantidad</th>
                  <th className="px-5 py-3.5">Motivo del Movimiento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {inventoryLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No hay registros en el historial de inventario.
                    </td>
                  </tr>
                ) : (
                  inventoryLogs.map(log => {
                    const item = inventory.find(i => i.id === log.item_id);
                    const isIn = log.type === 'in';

                    return (
                      <tr key={log.id} className="hover:bg-slate-850/40 transition-colors">
                        <td className="px-5 py-3.5 text-slate-400 font-mono-code text-[11px]">
                          {new Date(log.created_at).toLocaleString('es-ES')}
                        </td>
                        <td className="px-4 py-3.5 font-medium text-white">
                          {item ? item.item_name : 'Artículo'}
                        </td>
                        <td className="px-4 py-3.5">
                          {isIn ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              <ArrowDownRight className="w-3 h-3" />
                              <span>Entrada (+)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              <ArrowUpRight className="w-3 h-3" />
                              <span>Salida (-)</span>
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 font-mono-code font-bold text-sm">
                          <span className={isIn ? 'text-emerald-400' : 'text-rose-400'}>
                            {isIn ? '+' : '-'}{log.change_amount} {item?.unit || 'uds'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-300">
                          {log.reason}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Inventory Item Modal */}
      {isNewItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass-panel border border-slate-800 bg-slate-950 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif-luxury text-lg font-bold text-white">
                Nuevo Artículo de Inventario
              </h3>
              <button
                onClick={() => setIsNewItemModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Nombre del Producto / Suministro *</label>
                <input
                  type="text"
                  required
                  value={newItemForm.item_name}
                  onChange={(e) => setNewItemForm({ ...newItemForm, item_name: e.target.value })}
                  placeholder="Ej. Cava Brut Reserva 750ml"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Categoría</label>
                <select
                  value={newItemForm.category}
                  onChange={(e) => setNewItemForm({ ...newItemForm, category: e.target.value as InventoryCategory })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="amenities">Amenities y Baño</option>
                  <option value="minibar">Minibar y Bebidas</option>
                  <option value="limpieza">Lencería y Limpieza</option>
                  <option value="mantenimiento">Mantenimiento y Repuestos</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newItemForm.quantity}
                    onChange={(e) => setNewItemForm({ ...newItemForm, quantity: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono-code focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Alerta Mínima</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newItemForm.min_stock_alert}
                    onChange={(e) => setNewItemForm({ ...newItemForm, min_stock_alert: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono-code focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Unidad</label>
                  <input
                    type="text"
                    required
                    value={newItemForm.unit}
                    onChange={(e) => setNewItemForm({ ...newItemForm, unit: e.target.value })}
                    placeholder="uds / botellas"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewItemModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-5 py-2 rounded-xl shadow-md shadow-amber-500/20"
                >
                  Crear Artículo
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
