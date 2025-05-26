import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Reminder, Vehicle } from '@/types';
import { useStoredUser } from '@/hooks/useStoredData';

export const useUserReminders = () => {
  const { user } = useStoredUser();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReminders = async () => {
    if (!user) {
      setError('User not authenticated');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch reminders for the current user
      const { data: remindersData, error: remindersError } = await supabase
        .from('reminders')
        .select('*')
        .eq('userid', user.uuid)
        .order('dueDate', { ascending: true });

      if (remindersError) throw remindersError;

      // Get unique vehicle IDs from reminders
      const vehicleIds = [
        ...new Set(remindersData?.map((r) => r.vehicleId).filter(Boolean)),
      ];

      // Fetch associated vehicles
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('cars')
        .select('*')
        .in('id', vehicleIds)
        .eq('userId', user.uuid);

      if (vehiclesError) throw vehiclesError;

      setReminders(remindersData || []);
      setVehicles(vehiclesData || []);
    } catch (err) {
      //@ts-ignore
      setError(err.message || 'Failed to fetch reminders');
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    await fetchReminders();
  };

  // Initial fetch
  useEffect(() => {
    fetchReminders();
  }, [user]);

  return {
    reminders,
    vehicles,
    isLoading,
    error,
    refresh,
  };
};
