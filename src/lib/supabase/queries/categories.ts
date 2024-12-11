import { supabase } from '../client';
import type { Category } from '@/types/category';

const defaultCategories: Category[] = [
  { name: 'Nature', description: 'Beautiful natural landscapes and phenomena', created_at: new Date().toISOString() },
  { name: 'Urban', description: 'City life and urban landscapes', created_at: new Date().toISOString() },
  { name: 'Aerial', description: 'Drone footage and aerial views', created_at: new Date().toISOString() }
];

export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('ss_category')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('[Supabase] Falling back to default categories:', error);
    return defaultCategories;
  }
}