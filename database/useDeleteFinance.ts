// hooks/useDeleteFinancialRecord.ts
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

export const useDeleteFinancialRecord = () => {
  const router = useRouter();

  const deleteFinancialRecord = async (id: string) => {
    try {
      const { error } = await supabase.from('finances').delete().eq('id', id);

      if (error) throw error;

      // Success - navigate back
      router.back();
      return true;
    } catch (error) {
      Alert.alert(
        'Error',
        //@ts-ignore
        error.message || 'Failed to delete financial record'
      );
      return false;
    }
  };

  return { deleteFinancialRecord };
};
