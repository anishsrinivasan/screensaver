import { useState, useEffect } from 'react';
import { getCategories } from '@/lib/supabase';
import type { Category } from '@/types/category';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        const data = await getCategories();
        if (isMounted) {
          setCategories(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    categories,
    isLoading,
    error,
    hasError: error !== null
  };
}