// hooks/useVehicleFinances.ts
import { supabase } from '@/lib/supabase';
import { FinancialRecord } from '@/types';
import { useState, useEffect } from 'react';

export const useVehicleFinances = (vehicleId: string) => {
  const [finances, setFinances] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFinances = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .eq('vehicleId', vehicleId)
        .order('date', { ascending: false });

      if (error) throw error;
      setFinances(data || []);
    } catch (err) {
      //@ts-ignore
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinances();
  }, [vehicleId]);

  return { finances, loading, error, refetch: fetchFinances };
};
