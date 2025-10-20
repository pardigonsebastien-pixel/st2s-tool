import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Eleve {
  eleve_id: string;
  nom: string;
  prenom: string;
  photo: string | null;
  classe: '1re' | 'Tle';
  groupe: 'A' | 'B';
  pretotal: number;
  created_at?: string;
  updated_at?: string;
}
