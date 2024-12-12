import { supabase } from '@/lib/supabase';
import type { Video } from '@/types/video';

export async function fetchVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from('ss_videos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }

  return data;
}

export async function fetchVideosByCategory(category: string): Promise<Video[]> {
  const { data, error } = await supabase
    .from('ss_videos')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching videos by category:', error);
    throw error;
  }

  return data;
}