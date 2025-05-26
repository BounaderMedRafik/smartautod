// hooks/useAddMaintenance.ts
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MaintenanceRecord } from '@/types';

export function useAddMaintenance() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMaintenanceRecord = async (
    record: Omit<MaintenanceRecord, 'id'>
  ) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('maintenance')
        .insert([record])
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      return data;
    } catch (err) {
      console.error('Error adding maintenance record:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to add maintenance record'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addMaintenanceRecord, loading, error };
}
