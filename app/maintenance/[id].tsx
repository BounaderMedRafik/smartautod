import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Car,
  MapPin,
  DollarSign,
  FileText,
  Edit2,
  Trash2,
  AlertTriangle,
} from 'lucide-react-native';
import { MaintenanceRecord, Vehicle } from '@/types';
import { MOCK_MAINTENANCE, MOCK_VEHICLES } from '@/assets/MOCKDATA';

export default function MaintenanceDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [record, setRecord] = useState<MaintenanceRecord | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Find maintenance record by id
    const foundRecord = MOCK_MAINTENANCE.find((m) => m.id === id);
    if (foundRecord) {
      setRecord(foundRecord);
      // Find associated vehicle
      const foundVehicle = MOCK_VEHICLES.find(
        (v) => v.id === foundRecord.vehicleId
      );
      if (foundVehicle) {
        setVehicle(foundVehicle);
      }
    }
  }, [id]);

  const handleDelete = () => {
    // Here you would typically make an API call to delete the record
    console.log('Deleting record:', id);
    router.back();
  };

  const handleEdit = () => {
    router.push(`/maintenance/edit/${id}`);
  };

  if (!record || !vehicle) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Maintenance Details',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <ArrowLeft size={24} color="#1F2937" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={() => setShowDeleteConfirm(true)}
                style={styles.headerButton}
              >
                <Trash2 size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{record.title}</Text>
            <View style={styles.vehicleInfo}>
              <Car size={16} color="#6B7280" />
              <Text style={styles.vehicleName}>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </Text>
            </View>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Calendar size={20} color="#6B7280" />
                <View style={styles.detailText}>
                  <Text style={styles.detailLabel}>Service Date</Text>
                  <Text style={styles.detailValue}>
                    {new Date(record.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View style={styles.detailItem}>
                <Car size={20} color="#6B7280" />
                <View style={styles.detailText}>
                  <Text style={styles.detailLabel}>Mileage</Text>
                  <Text style={styles.detailValue}>
                    {record.mileage.toLocaleString()} mi
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <DollarSign size={20} color="#6B7280" />
                <View style={styles.detailText}>
                  <Text style={styles.detailLabel}>Cost</Text>
                  <Text style={styles.detailValue}>
                    ${record.cost.toFixed(2)}
                  </Text>
                </View>
              </View>
              {record.location && (
                <View style={styles.detailItem}>
                  <MapPin size={20} color="#6B7280" />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Location</Text>
                    <Text style={styles.detailValue}>{record.location}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {record.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{record.description}</Text>
            </View>
          )}

          {record.receipt && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Receipt</Text>
              <Image
                source={{ uri: record.receipt }}
                style={styles.receiptImage}
                resizeMode="contain"
              />
            </View>
          )}
        </View>
      </ScrollView>

      {showDeleteConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <AlertTriangle size={32} color="#EF4444" />
            </View>
            <Text style={styles.modalTitle}>Delete Record?</Text>
            <Text style={styles.modalMessage}>
              This action cannot be undone. Are you sure you want to delete this
              maintenance record?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDeleteConfirm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerButton: {
    padding: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1F2937',
    marginBottom: 8,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: 16,
  },
  detailText: {
    marginLeft: 12,
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1F2937',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  receiptImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalIcon: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
  cancelButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginLeft: 8,
  },
  deleteButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
});
