import React, { useEffect, useState } from 'react';
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
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

type Filter = 'all' | 'scheduled' | 'completed';

export default function MaintenanceScreen() {
  const { lang } = useLanguage(); // 👈 Get current language
  const [refreshing, setRefreshing] = useState(false);
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const router = useRouter();

  const fetchMaintenanceRecords = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('maintenance')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setRecords(data as MaintenanceRecord[]);
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase.from('cars').select('*');
      if (error) throw error;
      setVehicles(data as Vehicle[]);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  useEffect(() => {
    fetchMaintenanceRecords();
    fetchVehicles();
  }, []);

  const onRefresh = React.useCallback(() => {
    fetchMaintenanceRecords();
  }, []);

  const handleAddMaintenance = () => {
    router.push('/maintenance/add');
  };

  const handleRecordPress = (recordId: string) => {
    router.push(`/maintenance/${recordId}`);
  };

  const filteredRecords = React.useMemo(() => {
    let filtered = [...records];

    if (selectedVehicle) {
      filtered = filtered.filter(
        (record) => record.vehicleId === selectedVehicle
      );
    }

    if (filter === 'scheduled') {
      filtered = filtered.filter(
        (record) => record.isScheduled && !record.isDone
      );
    } else if (filter === 'completed') {
      filtered = filtered.filter((record) => record.isDone);
    }

    return filtered;
  }, [records, filter, selectedVehicle]);

  const renderMaintenanceItem = ({ item }: { item: MaintenanceRecord }) => {
    const vehicle = vehicles.find((v) => v.id === item.vehicleId);

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
                : lang === 'eng'
                ? 'Unknown Vehicle'
                : lang === 'fr'
                ? 'Véhicule inconnu'
                : 'مركبة غير معروفة'}
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
              {item.mileage?.toLocaleString() || 'N/A'} klm
            </Text>
          </View>
          {item.cost && (
            <View style={styles.detailItem}>
              <DollarSign size={16} color="#6B7280" />
              <Text style={styles.detailText}>DZD • {item.cost}</Text>
            </View>
          )}
        </View>
        {item.isScheduled && !item.isDone && (
          <View style={styles.scheduledBadge}>
            <Text style={styles.scheduledText}>
              {lang === 'eng' ? 'Scheduled' : lang === 'fr' ? 'Prévu' : 'مجدول'}
            </Text>
          </View>
        )}
        {item.isDone && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>
              {lang === 'eng'
                ? 'Completed'
                : lang === 'fr'
                ? 'Terminé'
                : 'مكتمل'}
            </Text>
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
              {lang === 'eng'
                ? 'All Records'
                : lang === 'fr'
                ? 'Tous les enregistrements'
                : 'جميع السجلات'}
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
              {lang === 'eng' ? 'Scheduled' : lang === 'fr' ? 'Prévu' : 'مجدول'}
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
              {lang === 'eng'
                ? 'Completed'
                : lang === 'fr'
                ? 'Terminé'
                : 'مكتمل'}
            </Text>
          </TouchableOpacity>

          {vehicles.map((vehicle) => (
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
          <Text style={styles.emptyTitle}>
            {lang === 'eng'
              ? 'No Records Found'
              : lang === 'fr'
              ? 'Aucun enregistrement trouvé'
              : 'لم يتم العثور على سجلات'}
          </Text>
          <Text style={styles.emptyText}>
            {selectedVehicle
              ? lang === 'eng'
                ? 'Try selecting a different vehicle or changing your filters'
                : lang === 'fr'
                ? 'Essayez de sélectionner un autre véhicule ou de modifier vos filtres'
                : 'حاول تحديد مركبة أخرى أو تغيير عوامل التصفية'
              : lang === 'eng'
              ? 'Add your first maintenance record to get started'
              : lang === 'fr'
              ? 'Ajoutez votre premier enregistrement de maintenance pour commencer'
              : 'أضف أول سجل صيانة للبدء'}
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={handleAddMaintenance}
          >
            <Text style={styles.emptyButtonText}>
              {lang === 'eng'
                ? 'Add Maintenance Record'
                : lang === 'fr'
                ? 'Ajouter un enregistrement'
                : 'إضافة سجل صيانة'}
            </Text>
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
  completedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  completedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#065F46',
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
