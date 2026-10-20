import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Key, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Code2, 
  RefreshCw
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const { 
    isLiveSupabase, 
    supabaseUrl, 
    supabaseKey, 
    setSupabaseConfig, 
    supabaseError, 
    refreshData 
  } = useHotel();

  const [inputUrl, setInputUrl] = useState<string>(supabaseUrl || 'https://ejwpqfwniedhnjvhtmlg.supabase.co');
  const [inputKey, setInputKey] = useState<string>(supabaseKey || '');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [showSql, setShowSql] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setFeedback(null);

    const success = await setSupabaseConfig(inputUrl.trim(), inputKey.trim());
    setIsTesting(false);

    if (success) {
      setFeedback({ success: true, message: '¡Conexión establecida con éxito con Supabase!' });
    } else {
      setFeedback({ 
        success: false, 
        message: 'No se pudo conectar con la clave proporcionada o las tablas aún no están creadas en Supabase.' 
      });
    }
  };

  const handleCopySql = () => {
    const sqlText = `-- Ejecuta este script en Supabase Dashboard > SQL Editor:
-- Tablas: rooms (20 habs), guests, bookings, inventory_stock, inventory_log
-- Revisa el archivo: supabase/schema.sql`;
    navigator.clipboard.writeText(sqlText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="glass-panel border border-slate-800 bg-slate-950 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-luxury text-lg font-bold text-white">
                Conexión Supabase (ejwpqfwniedhnjvhtmlg)
              </h2>
              <p className="text-xs text-slate-400">Base de datos en la nube para Hotel Riss</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status banner */}
        <div className={`p-3.5 rounded-xl border text-xs flex items-center space-x-3 ${
          isLiveSupabase 
            ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300' 
            : 'bg-amber-950/30 border-amber-800/40 text-amber-300'
        }`}>
          {isLiveSupabase ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <div>
            <div className="font-bold">
              {isLiveSupabase 
                ? 'Conectado en Vivo a Supabase' 
                : 'Modo Local / Demo con Supabase Ready'}
            </div>
            <div className="text-[11px] opacity-90 mt-0.5">
              {isLiveSupabase 
                ? 'Todas las reservas, habitaciones, CRM e inventario se sincronizan en tiempo real con tu proyecto Supabase.' 
                : 'La aplicación funciona con persistencia local. Introduce tu anon key de Supabase para activar la sincronización en la nube.'}
            </div>
          </div>
        </div>

        {supabaseError && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 font-mono-code">
            {supabaseError}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleTestAndSave} className="space-y-4 text-xs">
          
          <div>
            <label className="text-slate-300 font-semibold flex items-center space-x-1.5 mb-1">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>Supabase Project URL</span>
            </label>
            <input
              type="url"
              required
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono-code focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold flex items-center space-x-1.5 mb-1">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Supabase Anon Public Key</span>
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono-code focus:outline-none focus:border-amber-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              La encuentras en: Supabase Dashboard &gt; Project Settings &gt; API &gt; Project API keys (anon public).
            </p>
          </div>

          {feedback && (
            <div className={`p-2.5 rounded-xl border text-xs ${
              feedback.success 
                ? 'bg-emerald-950/30 text-emerald-300 border-emerald-800/50' 
                : 'bg-rose-950/30 text-rose-300 border-rose-800/50'
            }`}>
              {feedback.message}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowSql(!showSql)}
              className="text-amber-400 hover:text-amber-300 font-medium flex items-center space-x-1.5"
            >
              <Code2 className="w-4 h-4" />
              <span>{showSql ? 'Ocultar Script SQL' : 'Ver Esquema SQL'}</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => refreshData()}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                title="Recargar datos"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              
              <button
                type="submit"
                disabled={isTesting}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl shadow-md transition-all flex items-center space-x-1.5"
              >
                {isTesting ? <span>Conectando...</span> : <span>Guardar y Probar</span>}
              </button>
            </div>
          </div>
        </form>

        {/* SQL Schema View */}
        {showSql && (
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300 font-semibold">
              <span>Script SQL de Tablas y 20 Habitaciones</span>
              <button
                onClick={handleCopySql}
                className="text-amber-400 hover:text-amber-300 flex items-center space-x-1 text-[11px]"
              >
                {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSql ? 'Copiado' : 'Copiar referencia'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              El archivo completo está generado en <strong className="text-amber-400">supabase/schema.sql</strong>.
              Cópialo y pégalo en el <em>SQL Editor</em> de tu consola Supabase para crear las 5 tablas, RLS, triggers y sembrar las 20 habitaciones.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
