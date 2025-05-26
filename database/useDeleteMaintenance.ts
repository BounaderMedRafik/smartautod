import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Alert } from 'react-native';

export const useDeleteMaintenance = () => {
  const router = useRouter();

  const deleteMaintenanceRecord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('maintenance')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Success - navigate back
      router.back();
      return true;
    } catch (error) {
      Alert.alert(
        'Error',
        //@ts-ignore
        error.message || 'Failed to delete maintenance record'
      );
      return false;
    }
  };

  return { deleteMaintenanceRecord };
};
