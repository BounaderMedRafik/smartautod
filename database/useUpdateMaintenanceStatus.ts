import { supabase } from '@/lib/supabase';

// hooks/useUpdateMaintenanceStatus.ts
export const useUpdateMaintenanceStatus = () => {
  const updateStatus = async (
    id: string,
    status: {
      isScheduled: boolean;
      isDone: boolean;
    }
  ) => {
    try {
      const { error } = await supabase
        .from('maintenance')
        .update(status)
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating status:', error);
      return false;
    }
  };

  return { updateStatus };
};
