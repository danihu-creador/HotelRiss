import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowDownRight, 
  ArrowUpRight, 
  Package, 
  FileText 
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';

interface StockMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultItemId?: string;
  defaultType?: 'in' | 'out';
}

export const StockMovementModal: React.FC<StockMovementModalProps> = ({
  isOpen,
  onClose,
  defaultItemId,
  defaultType = 'in'
}) => {
  const { inventory, registerStockChange } = useHotel();

  const [itemId, setItemId] = useState<string>('');
  const [movementType, setMovementType] = useState<'in' | 'out'>('in');
  const [amount, setAmount] = useState<number>(5);
  const [reason, setReason] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setItemId(defaultItemId || inventory[0]?.id || '');
      setMovementType(defaultType || 'in');
      setAmount(5);
      setReason(defaultType === 'in' ? 'Recepción de pedido proveedor' : 'Consumo / Reposición habitaciones');
    }
  }, [isOpen, defaultItemId, defaultType, inventory]);

  if (!isOpen) return null;

  const selectedItem = inventory.find(i => i.id === itemId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemId || amount <= 0 || !reason.trim()) {
      alert('Por favor, indica un artículo, una cantidad mayor a 0 y el motivo.');
      return;
    }

    await registerStockChange(itemId, amount, movementType, reason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="glass-panel border border-slate-800 bg-slate-950 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-xl ${movementType === 'in' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {movementType === 'in' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="font-serif-luxury text-lg font-bold text-white">
                {movementType === 'in' ? 'Entrada / Reposición de Stock' : 'Salida / Consumo de Stock'}
              </h2>
              <p className="text-xs text-slate-400">Actualiza existencias y registra en el log.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Movement Type Switcher */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Tipo de Movimiento</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMovementType('in');
                  if (!reason || reason.includes('Consumo')) setReason('Recepción de pedido proveedor');
                }}
                className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center space-x-2 border transition-all ${
                  movementType === 'in'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <ArrowDownRight className="w-4 h-4" />
                <span>Entrada (+) Reposición</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMovementType('out');
                  if (!reason || reason.includes('Recepción')) setReason('Consumo / Reposición habitaciones');
                }}
                className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center space-x-2 border transition-all ${
                  movementType === 'out'
                    ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Salida (-) Consumo</span>
              </button>
            </div>
          </div>

          {/* Item Selector */}
          <div>
            <label className="text-slate-300 font-semibold flex items-center space-x-1.5 mb-1.5">
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span>Artículo de Inventario *</span>
            </label>
            <select
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-amber-500"
            >
              {inventory.map(item => (
                <option key={item.id} value={item.id}>
                  {item.item_name} (Actual: {item.quantity} {item.unit} | Mín: {item.min_stock_alert})
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Cantidad a {movementType === 'in' ? 'añadir' : 'retirar'} ({selectedItem?.unit || 'uds'}) *
            </label>
            <input
              type="number"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono-code text-base font-bold focus:outline-none focus:border-amber-500"
            />
            {selectedItem && (
              <p className="text-[11px] text-slate-400 mt-1">
                Stock resultante:{' '}
                <strong className="text-amber-400">
                  {movementType === 'in' ? selectedItem.quantity + amount : Math.max(0, selectedItem.quantity - amount)}{' '}
                  {selectedItem.unit}
                </strong>
              </p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="text-slate-300 font-semibold flex items-center space-x-1.5 mb-1">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Motivo del Movimiento (Trazabilidad) *</span>
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej. Reposición habitaciones planta 1, rotura, pedido distribuidor..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
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
              className={`font-bold px-5 py-2 rounded-xl shadow-md text-white transition-all ${
                movementType === 'in' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
              }`}
            >
              {movementType === 'in' ? 'Confirmar Entrada' : 'Registrar Salida'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
