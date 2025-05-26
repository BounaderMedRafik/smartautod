// hooks/useAddReminder.ts
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { Alert } from 'react-native';
import { Reminder } from '@/types';

export const useAddReminder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addReminder = async (reminder: Omit<Reminder, 'id' | 'isComplete'>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('reminders')
        .insert({
          vehicleId: reminder.vehicleId,
          userid: reminder.userid,
          title: reminder.title,
          description: reminder.description,
          dueDate: reminder.dueDate,
          dueMileage: reminder.dueMileage || null,
          type: reminder.type,
          recurringInterval: reminder.recurringInterval || null,
          recurringMileage: reminder.recurringMileage || null,
          isComplete: false, // Default to false for new reminders
        })
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      return data as Reminder;
    } catch (err) {
      //@ts-ignore
      setError(err.message || 'Failed to add reminder');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addReminder, loading, error };
};
