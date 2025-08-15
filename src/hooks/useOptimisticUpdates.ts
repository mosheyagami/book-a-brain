import { useState, useCallback } from 'react';

interface OptimisticState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

export const useOptimisticUpdates = <T extends { id: string }>(
  initialData: T[] = []
) => {
  const [state, setState] = useState<OptimisticState<T>>({
    data: initialData,
    loading: false,
    error: null
  });

  const addOptimistic = useCallback((item: T) => {
    setState(prev => ({
      ...prev,
      data: [...prev.data, item]
    }));
  }, []);

  const updateOptimistic = useCallback((id: string, updates: Partial<T>) => {
    setState(prev => ({
      ...prev,
      data: prev.data.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  }, []);

  const removeOptimistic = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      data: prev.data.filter(item => item.id !== id)
    }));
  }, []);

  const setData = useCallback((data: T[]) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  return {
    ...state,
    addOptimistic,
    updateOptimistic,
    removeOptimistic,
    setData,
    setLoading,
    setError
  };
};