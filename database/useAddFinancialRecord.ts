// hooks/useAddFinancialRecord.ts
import { supabase } from '@/lib/supabase';
import { FinancialRecord } from '@/types';
import { useState } from 'react';

export const useAddFinancialRecord = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFinancialRecord = async (record: Omit<FinancialRecord, 'id'>) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('finances')
        .insert(record)
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      return data;
    } catch (err) {
      //@ts-ignore
      setError(err.message || 'Failed to add financial record');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addFinancialRecord, loading, error };
};
