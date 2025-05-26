import { useFetchCarById } from '@/database/useFetchCarById';
import { useVehicleReminders } from '@/database/useVehicleReminders';
import { useStoredUser } from '@/hooks/useStoredData';
import { getDateDifferenceText } from '@/lib/dateUtils';
import { supabase } from '@/lib/supabase';
import { Vehicle, VehicleCardProps } from '@/types';
import { useRouter } from 'expo-router';
import {
  Calendar,
  Car,
  CarFront,
  Fuel,
  Info,
  PlusCircle,
} from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function useUserVehicles() {
  const { user } = useStoredUser();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      if (!user?.uuid) return;

      const { data, error: supabaseError } = await supabase
        .from('cars')
        .select('*')
        .eq('userId', user.uuid);

      if (supabaseError) throw supabaseError;
      setVehicles(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user?.uuid]);

  // Initial fetch
  React.useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    loading,
    error,
    refetchVehicles: fetchVehicles,
  };
}

const VehicleCard = ({ vehicle, userId, onPress }: VehicleCardProps) => {
  const { nearestReminder, loading: reminderLoading } = useVehicleReminders(
    vehicle.id,
    userId
  );

  const { maintenance, finances, reminders, loading, error, refetch } =
    useFetchCarById(vehicle.id as string);

  const getLatestMileage = () => {
    // Get all maintenance mileages
    const maintenanceMileages = maintenance.map((m) => m.mileage);

    // Get all finance mileages (assuming finances have mileage field)
    //@ts-ignore
    const financeMileages = finances.map((f) => f.mileage || 0);

    // Combine all mileages with current vehicle mileage
    const allMileages = [
      ...maintenanceMileages,
      ...financeMileages,
      vehicle?.mileage,
    ];

    // Return the highest mileage
    return Math.max(...allMileages);
  };

  return (
    <TouchableOpacity style={styles.vehicleCard} onPress={onPress}>
      <View style={styles.vehicleImageContainer}>
        {vehicle.imageUrl ? (
          <Image
            source={{ uri: vehicle.imageUrl }}
            style={styles.vehicleImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImagePlaceholder}>
            <Car size={40} color="#9CA3AF" />
          </View>
        )}
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleName}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </Text>
          <Text style={styles.vehiclePlate}>{vehicle.licensePlate}</Text>
        </View>
      </View>

      <View style={styles.vehicleStats}>
        <View style={styles.statItem}>
          <Fuel size={18} color="#6B7280" />
          <Text style={styles.statLabel}>Kilometrage</Text>
          <Text style={styles.statValue}>
            {getLatestMileage().toLocaleString()} klms{' '}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Calendar size={18} color="#6B7280" />
          <Text style={styles.statLabel}>Next Service</Text>
          <Text style={styles.statValue}>
            {reminderLoading ? (
              <ActivityIndicator size="small" color="#6B7280" />
            ) : nearestReminder ? (
              new Date(nearestReminder.dueDate).toLocaleDateString()
            ) : (
              'No upcoming reminders'
            )}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function DashboardScreen() {
  const { user } = useStoredUser();
  const {
    vehicles: fetchedVehicles,
    loading,
    refetchVehicles,
  } = useUserVehicles();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetchVehicles().finally(() => {
      setRefreshing(false);
    });
  }, [refetchVehicles]);

  const handleAddVehicle = () => {
    router.push('/vehicle/add');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B6FE0"
          />
        }
      >
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B6FE0" />
            <Text style={styles.loadingText}>Loading your vehicles...</Text>
          </View>
        ) : fetchedVehicles.length === 0 ? (
          <View style={styles.emptyState}>
            <CarFront size={60} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>No Vehicles Yet</Text>
            <Text style={styles.emptyStateText}>
              Add your first vehicle to get started
            </Text>
            <TouchableOpacity
              style={styles.addVehicleButton}
              onPress={handleAddVehicle}
            >
              <Text style={styles.addVehicleButtonText}>Add Vehicle</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>My Vehicles</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddVehicle}
              >
                <PlusCircle size={24} color="#3B6FE0" />
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.vehicleCards}>
              {fetchedVehicles
                .slice()
                .reverse()
                .map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    userId={user?.uuid}
                    onPress={() => router.push(`/vehicle/${vehicle.id}`)}
                  />
                ))}
            </View>

            <View style={styles.tipsContainer}>
              <View style={styles.tipCard}>
                <View style={styles.tipIconContainer}>
                  <Info size={20} color="#3B6FE0" />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Maintenance Tip</Text>
                  <Text style={styles.tipText}>
                    Check your tire pressure monthly and before long trips for
                    optimal performance and safety.
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 48,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3B6FE0',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 48,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  addVehicleButton: {
    backgroundColor: '#3B6FE0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addVehicleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  vehicleCards: {
    marginBottom: 24,
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  vehicleImageContainer: {
    height: 160,
    position: 'relative',
    backgroundColor: '#F3F4F6',
  },
  noImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  vehicleInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  vehiclePlate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  vehicleStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  tipsContainer: {
    marginTop: 8,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
