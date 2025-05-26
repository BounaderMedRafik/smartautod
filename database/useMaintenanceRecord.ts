import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Adjust the import path as needed
import { MaintenanceRecord } from '@/types';

export const useMaintenanceRecord = (id: string) => {
  const [record, setRecord] = useState<MaintenanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from('maintenance')
          .select('*')
          .eq('id', id)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        setRecord(data as MaintenanceRecord);
      } catch (err) {
        //@ts-ignore
        setError(err.message || 'Failed to fetch maintenance record');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecord();
    }
  }, [id]);

  return { record, loading, error };
};
