import { supabase } from '@/lib/supabase';
import type { Video } from '@/types/video';

export async function getVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from('ss_videos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }

  return data.map(video => ({
    id: parseInt(video.id),
    title: video.title,
    author: video.author,
    source: video.source,
    url: video.url
  }));
}

export async function getVideosByCategory(category: string): Promise<Video[]> {
  const { data, error } = await supabase
    .from('ss_videos')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching videos by category:', error);
    throw error;
  }

  return data.map(video => ({
    id: parseInt(video.id),
    title: video.title,
    author: video.author,
    source: video.source,
    url: video.url
  }));
}

export async function getCategories() {
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