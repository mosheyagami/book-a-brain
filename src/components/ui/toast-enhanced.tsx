import { toast as baseToast } from '@/hooks/use-toast';

export const toast = {
  success: (title: string, description?: string) => {
    baseToast({
      title,
      description,
      variant: 'default',
      duration: 3000,
    });
  },
  
  error: (title: string, description?: string) => {
    baseToast({
      title,
      description,
      variant: 'destructive',
      duration: 5000,
    });
  },
  
  warning: (title: string, description?: string) => {
    baseToast({
      title,
      description,
      className: 'border-warning bg-warning text-warning-foreground',
      duration: 4000,
    });
  },
  
  info: (title: string, description?: string) => {
    baseToast({
      title,
      description,
      variant: 'default',
      duration: 3000,
    });
  },
  
  loading: (title: string, description?: string) => {
    return baseToast({
      title,
      description,
      duration: Infinity,
    });
  },
  
  promise: async <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: { title: string; description?: string };
      success: { title: string; description?: string } | ((data: T) => { title: string; description?: string });
      error: { title: string; description?: string } | ((error: any) => { title: string; description?: string });
    }
  ) => {
    const toastId = toast.loading(loading.title, loading.description);
    
    try {
      const data = await promise;
      const successConfig = typeof success === 'function' ? success(data) : success;
      
      toastId.dismiss();
      toast.success(successConfig.title, successConfig.description);
      
      return data;
    } catch (err) {
      const errorConfig = typeof error === 'function' ? error(err) : error;
      
      toastId.dismiss();
      toast.error(errorConfig.title, errorConfig.description);
      
      throw err;
    }
  }
};