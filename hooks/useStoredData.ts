import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { supaUser } from '@/types/db';

export function useStoredUser() {
  const [user, setUser] = useState<supaUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user from SecureStore:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return { user, loading };
}
