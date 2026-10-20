import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Default Supabase project ref extracted from user's MCP URL: ejwpqfwniedhnjvhtmlg
const DEFAULT_PROJECT_REF = 'ejwpqfwniedhnjvhtmlg';
const DEFAULT_URL = `https://${DEFAULT_PROJECT_REF}.supabase.co`;

export function getSupabaseCredentials() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const localUrl = localStorage.getItem('hotel_riss_supabase_url');
  const localKey = localStorage.getItem('hotel_riss_supabase_key');

  const url = localUrl || envUrl || DEFAULT_URL;
  const key = localKey || envKey || '';

  return { url, key, isConfigured: Boolean(key && key.trim().length > 10) };
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key, isConfigured } = getSupabaseCredentials();
  if (!isConfigured) return null;

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (e) {
      console.warn('Could not initialize Supabase client:', e);
      return null;
    }
  }
  return supabaseInstance;
}

export function resetSupabaseClient(url: string, key: string) {
  localStorage.setItem('hotel_riss_supabase_url', url);
  localStorage.setItem('hotel_riss_supabase_key', key);
  try {
    supabaseInstance = createClient(url, key);
  } catch (err) {
    console.error('Failed to instantiate Supabase client with new credentials', err);
    supabaseInstance = null;
  }
}
