import { useState } from 'react';
import { supabase } from '@/lib/supabase'; // adjust the import path as needed

export const useReminder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteReminder = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from('reminders').delete().eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (err) {
      //@ts-ignore
      setError(err.message || 'Failed to delete reminder');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReminder = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (err) {
      //@ts-ignore
      setError(err.message || 'Failed to fetch reminder');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVehicle = async (vehicleId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', vehicleId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (err) {
      //@ts-ignore
      setError(err.message || 'Failed to fetch vehicle');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    deleteReminder,
    fetchReminder,
    fetchVehicle,
  };
};
