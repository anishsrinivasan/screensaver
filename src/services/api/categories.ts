import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

export type Category = Database['public']['Tables']['ss_category']['Row'];

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('ss_category')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  return data;
}