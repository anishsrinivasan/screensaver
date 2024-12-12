import { supabase } from '../client';
import { fallbackVideos } from '@/data/videos';
import type { Video } from '@/types/video';

export async function getVideos(): Promise<Video[]> {
  try {
    const { data, error } = await supabase
      .from('ss_videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('[Supabase] Falling back to local videos:', error);
    return fallbackVideos;
  }
}

export async function getVideosByCategory(category: string): Promise<Video[]> {
  try {
    const { data, error } = await supabase
      .from('ss_videos')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('[Supabase] Falling back to filtered local videos:', error);
    return fallbackVideos.filter(video => video.category === category);
  }
}