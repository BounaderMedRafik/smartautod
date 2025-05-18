import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  PlusCircle,
  CarFront,
  Fuel,
  Calendar,
  Wrench,
  Info,
} from 'lucide-react-native';
import { Vehicle } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { MOCK_VEHICLES } from '@/assets/MOCKDATA';
import { useStoredUser } from '@/hooks/useStoredData';

export default function DashboardScreen() {
  const { user } = useStoredUser();
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleAddVehicle = () => {
    router.push('/vehicle/add');
  };

  const handleVehiclePress = (vehicleId: string) => {
    router.push(`/vehicle/${vehicleId}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {vehicles.length === 0 ? (
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
              {vehicles.map((vehicle) => (
                <TouchableOpacity
                  key={vehicle.id}
                  style={styles.vehicleCard}
                  onPress={() => handleVehiclePress(vehicle.id)}
                >
                  <View style={styles.vehicleImageContainer}>
                    <Image
                      source={{ uri: vehicle.imageUrl }}
                      style={styles.vehicleImage}
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                      style={styles.gradientOverlay}
                    />
                    <View style={styles.vehicleInfo}>
                      <Text style={styles.vehicleName}>
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </Text>
                      <Text style={styles.vehiclePlate}>
                        {vehicle.licensePlate}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.vehicleStats}>
                    <View style={styles.statItem}>
                      <Fuel size={18} color="#6B7280" />
                      <Text style={styles.statLabel}>Mileage</Text>
                      <Text style={styles.statValue}>
                        {vehicle.mileage.toLocaleString()} mi
                      </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                      <Calendar size={18} color="#6B7280" />
                      <Text style={styles.statLabel}>Next Service</Text>
                      <Text style={styles.statValue}>In 10 days</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                      <Wrench size={18} color="#6B7280" />
                      <Text style={styles.statLabel}>Maintenance</Text>
                      <Text style={styles.statValue}>3 items</Text>
                    </View>
                  </View>
                </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  addButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
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
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
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
    fontFamily: 'Inter-Medium',
    fontSize: 16,
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
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  vehiclePlate: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
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
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  statValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
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
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  tipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
});
