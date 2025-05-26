import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useStoredUser } from '@/hooks/useStoredData';
import * as FileSystem from 'expo-file-system';

export interface VehicleInput {
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  mileage: number;
  purchaseDate: string;
  imageUri?: string;
  vin?: string;
}

export function useAddVehicle() {
  const { user, loading: userLoading } = useStoredUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (uri: string): Promise<string | null> => {
    try {
      if (!user) {
        setError('User not authenticated');
        return null;
      }

      // Read the file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to ArrayBuffer
      const arrayBuffer = Uint8Array.from(atob(base64), (c) =>
        c.charCodeAt(0)
      ).buffer;

      const filename = `${user.uuid}_${Date.now()}.jpg`;
      const contentType = 'image/jpeg';

      const { data, error: uploadError } = await supabase.storage
        .from('carimages')
        .upload(filename, arrayBuffer, {
          contentType,
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        setError(`Image upload failed: ${uploadError.message}`);
        return null;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('carimages').getPublicUrl(filename);

      return publicUrl;
    } catch (e) {
      console.error('Upload error:', e);
      setError(
        `Image upload failed: ${
          e instanceof Error ? e.message : 'Unknown error'
        }`
      );
      return null;
    }
  };

  const addVehicle = async (vehicle: VehicleInput) => {
    if (!user) {
      setError('User not loaded or logged in');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      let imageUrl: string | null = null;

      if (vehicle.imageUri) {
        imageUrl = await uploadImage(vehicle.imageUri);
        if (!imageUrl) {
          setLoading(false);
          return false;
        }
      }

      const { error: supabaseError } = await supabase.from('cars').insert({
        userId: user.uuid,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        licensePlate: vehicle.licensePlate,
        mileage: vehicle.mileage,
        purchaseDate: vehicle.purchaseDate,
        imageUrl: imageUrl,
        vin: vehicle.vin || null,
      });

      if (supabaseError) {
        throw supabaseError;
      }

      return true;
    } catch (e) {
      console.error('Error adding vehicle:', e);
      setError(e instanceof Error ? e.message : 'Failed to add vehicle');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { addVehicle, loading, error, userLoading };
}
