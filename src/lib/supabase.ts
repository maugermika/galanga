import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Menu = {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string | null;
  category: string;
  available: boolean;
  created_at: string;
};
