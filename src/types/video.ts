export interface Video {
  id: string;
  title: string;
  author: string;
  source: string;
  url: string;
  category?: string;
  tags?: string[];
  created_at?: string;
}