import { useState, useEffect } from 'react';
import { fetchCategories } from '@/services/api/categories';
import type { Category } from '@/services/api/categories';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, []);

  return {
    categories,
    isLoading,
    error,
    hasError: error !== null
  };
}