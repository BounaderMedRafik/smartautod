import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // adjust import path as needed
import { Reminder } from '@/types'; // adjust import path as needed

export const useVehicleReminders = (
  vehicleId: string,
  userId: string | undefined
) => {
  const [nearestReminder, setNearestReminder] = useState<Reminder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNearestReminder = async () => {
    try {
      if (!userId) return;

      setLoading(true);
      const currentDate = new Date().toISOString();

      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('vehicleId', vehicleId)
        .eq('userid', userId)
        .eq('isComplete', false)
        .gt('dueDate', currentDate) // only future reminders
        .order('dueDate', { ascending: true }) // sort by nearest date
        .limit(1);

      if (error) throw error;

      setNearestReminder(data?.[0] || null);
    } catch (err) {
      console.error('Error fetching reminders:', err);
      setError('Failed to fetch reminders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearestReminder();
  }, [vehicleId, userId]);

  return { nearestReminder, loading, error, refetch: fetchNearestReminder };
};
