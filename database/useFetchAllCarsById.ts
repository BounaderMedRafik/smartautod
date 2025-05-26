import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useStoredUser } from '@/hooks/useStoredData';
import { Vehicle } from '@/types';

export function useUserVehicles() {
  const { user, loading: userLoading } = useStoredUser();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!user || userLoading) return;

      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('cars')
        .select('*')
        .eq('userId', user.uuid)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        setError(supabaseError.message);
        setVehicles([]);
      } else {
        setVehicles(data as Vehicle[]);
      }

      setLoading(false);
    };

    fetchVehicles();
  }, [user, userLoading]);

  return {
    vehicles,
    loading,
    error,
  };
}
