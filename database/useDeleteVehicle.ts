import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useDeleteVehicle = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteVehicle = async (vehicleId: string) => {
    setIsDeleting(true);
    setError(null);

    try {
      // Delete related records first
      await supabase.from('reminders').delete().eq('vehicleId', vehicleId);
      await supabase.from('finances').delete().eq('vehicleId', vehicleId);
      await supabase.from('maintenance').delete().eq('vehicleId', vehicleId);

      // Then delete the vehicle
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', vehicleId);

      if (error) throw error;
      return true;
    } catch (err) {
      //@ts-ignore
      setError(err.message || 'Failed to delete vehicle');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    error,
    deleteVehicle,
  };
};
