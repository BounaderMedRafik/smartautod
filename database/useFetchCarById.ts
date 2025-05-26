// hooks/useFetchCarById.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { FinancialRecord, MaintenanceRecord, Reminder, Vehicle } from '@/types';

export function useFetchCarById(id: string) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
  const [finances, setFinances] = useState<FinancialRecord[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch vehicle
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();

      if (vehicleError) throw vehicleError;
      setVehicle(vehicleData);

      // Fetch related records in parallel
      const [
        { data: maintenanceData, error: maintenanceError },
        { data: financesData, error: financesError },
        { data: remindersData, error: remindersError },
      ] = await Promise.all([
        supabase.from('maintenance').select('*').eq('vehicleId', id),
        supabase.from('finances').select('*').eq('vehicleId', id),
        supabase.from('reminders').select('*').eq('vehicleId', id),
      ]);

      if (maintenanceError) throw maintenanceError;
      if (financesError) throw financesError;
      if (remindersError) throw remindersError;

      setMaintenance(maintenanceData || []);
      setFinances(financesData || []);
      setReminders(remindersData || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    vehicle,
    maintenance,
    finances,
    reminders,
    loading,
    error,
    refetch,
  };
}
