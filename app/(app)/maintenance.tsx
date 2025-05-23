import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  PlusCircle,
  Wrench,
  Calendar,
  DollarSign,
  ChevronRight,
  FilterX,
  Car,
} from 'lucide-react-native';
import { MaintenanceRecord, Vehicle } from '@/types';
import { MOCK_MAINTENANCE, MOCK_VEHICLES } from '@/assets/MOCKDATA';

type Filter = 'all' | 'scheduled' | 'completed';

export default function MaintenanceScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [records, setRecords] = useState<MaintenanceRecord[]>(MOCK_MAINTENANCE);
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const router = useRouter();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleAddMaintenance = () => {
    router.push('/maintenance/add');
  };

  const handleRecordPress = (recordId: string) => {
    router.push(`/maintenance/${recordId}`);
  };

  const filteredRecords = React.useMemo(() => {
    let filtered = [...records];

    // Apply vehicle filter if selected
    if (selectedVehicle) {
      filtered = filtered.filter(
        (record) => record.vehicleId === selectedVehicle
      );
    }

    // Apply status filter
    if (filter === 'scheduled') {
      filtered = filtered.filter(
        (record) => record.isScheduled && !record.isDone
      );
    } else if (filter === 'completed') {
      filtered = filtered.filter((record) => record.isDone);
    }

    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [records, filter, selectedVehicle]);

  const renderMaintenanceItem = ({ item }: { item: MaintenanceRecord }) => {
    const vehicle = MOCK_VEHICLES.find((v) => v.id === item.vehicleId);
    return (
      <TouchableOpacity
        style={styles.recordCard}
        onPress={() => handleRecordPress(item.id)}
      >
        <View style={styles.recordHeader}>
          <View style={styles.iconContainer}>
            <Wrench size={20} color="#3B6FE0" />
          </View>
          <View style={styles.recordInfo}>
            <Text style={styles.recordTitle}>{item.title}</Text>
            <Text style={styles.vehicleName}>
              {vehicle
                ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
                : 'Unknown Vehicle'}
            </Text>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </View>
        <View style={styles.recordDetails}>
          <View style={styles.detailItem}>
            <Calendar size={16} color="#6B7280" />
            <Text style={styles.detailText}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Car size={16} color="#6B7280" />
            <Text style={styles.detailText}>
              {item.mileage.toLocaleString()} mi
            </Text>
          </View>
          <View style={styles.detailItem}>
            <DollarSign size={16} color="#6B7280" />
            <Text style={styles.detailText}>${item.cost.toFixed(2)}</Text>
          </View>
        </View>
        {item.isScheduled && !item.isDone && (
          <View style={styles.scheduledBadge}>
            <Text style={styles.scheduledText}>Scheduled</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContent}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'all' && styles.filterButtonActive,
            ]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'all' && styles.filterTextActive,
              ]}
            >
              All Records
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'scheduled' && styles.filterButtonActive,
            ]}
            onPress={() => setFilter('scheduled')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'scheduled' && styles.filterTextActive,
              ]}
            >
              Scheduled
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'completed' && styles.filterButtonActive,
            ]}
            onPress={() => setFilter('completed')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'completed' && styles.filterTextActive,
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>

          {MOCK_VEHICLES.map((vehicle) => (
            <TouchableOpacity
              key={vehicle.id}
              style={[
                styles.filterButton,
                selectedVehicle === vehicle.id && styles.filterButtonActive,
              ]}
              onPress={() =>
                setSelectedVehicle(
                  selectedVehicle === vehicle.id ? null : vehicle.id
                )
              }
            >
              <Text
                style={[
                  styles.filterText,
                  selectedVehicle === vehicle.id && styles.filterTextActive,
                ]}
              >
                {vehicle.make} {vehicle.model}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddMaintenance}
        >
          <PlusCircle size={24} color="#3B6FE0" />
        </TouchableOpacity>
      </View>

      {filteredRecords.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FilterX size={48} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No Records Found</Text>
          <Text style={styles.emptyText}>
            {selectedVehicle
              ? 'Try selecting a different vehicle or changing your filters'
              : 'Add your first maintenance record to get started'}
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={handleAddMaintenance}
          >
            <Text style={styles.emptyButtonText}>Add Maintenance Record</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredRecords}
          renderItem={renderMaintenanceItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  filtersScrollContent: {
    paddingRight: 8,
    flexGrow: 1,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#EEF2FF',
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#3B6FE0',
  },
  addButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
  },
  separator: {
    height: 12,
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recordInfo: {
    flex: 1,
  },
  recordTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 2,
  },
  vehicleName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  recordDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 6,
  },
  scheduledBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FDDCA1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  scheduledText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#92400E',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#3B6FE0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
