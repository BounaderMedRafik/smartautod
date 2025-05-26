import { useDeleteMaintenance } from '@/database/useDeleteMaintenance';
import { useMaintenanceRecord } from '@/database/useMaintenanceRecord';
import { useUpdateMaintenanceStatus } from '@/database/useUpdateMaintenanceStatus';
import { supabase } from '@/lib/supabase';
import { Vehicle } from '@/types';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Car,
  DollarSign,
  MapPin,
  Pencil,
  Trash2,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function MaintenanceDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { record, loading, error } = useMaintenanceRecord(id as string);
  const { deleteMaintenanceRecord } = useDeleteMaintenance();
  const { updateStatus } = useUpdateMaintenanceStatus();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    'pending' | 'scheduled' | 'completed'
  >(
    record?.isDone ? 'completed' : record?.isScheduled ? 'scheduled' : 'pending'
  );

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!record?.vehicleId) return;

      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('id', record.vehicleId)
          .single();

        if (error) throw error;
        setVehicle(data as Vehicle);
      } catch (err) {
        console.error('Error fetching vehicle');
      }
    };

    fetchVehicle();
  }, [record]);

  useEffect(() => {
    if (record) {
      setSelectedStatus(
        record.isDone
          ? 'completed'
          : record.isScheduled
          ? 'scheduled'
          : 'pending'
      );
    }
  }, [record]);

  const handleDelete = async () => {
    await deleteMaintenanceRecord(id as string);
    setShowDeleteConfirm(false);
  };

  const handleStatusChange = async () => {
    const statusUpdate = {
      isScheduled: selectedStatus === 'scheduled',
      isDone: selectedStatus === 'completed',
    };

    const success = await updateStatus(id as string, statusUpdate);
    if (success) {
      setShowStatusModal(false);
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
  ];

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!record || !vehicle) {
    return (
      <View style={styles.container}>
        <Text>Record not found</Text>
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
                onPress={() => setShowStatusModal(true)}
                style={[styles.headerButton, { marginRight: 16 }]}
              >
                <Text style={styles.editButtonText}>
                  <Pencil size={14} />
                </Text>
              </TouchableOpacity>
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
                  <Text style={styles.detailLabel}>Kilometrage</Text>
                  <Text style={styles.detailValue}>
                    {record.mileage.toLocaleString()} klm
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.detailRow}>
              {record.cost && (
                <View style={styles.detailItem}>
                  <DollarSign size={20} color="#6B7280" />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Cost</Text>
                    <Text style={styles.detailValue}>dzd{record.cost}</Text>
                  </View>
                </View>
              )}
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

            <View style={styles.statusRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <View
                style={[
                  styles.statusBadge,
                  record.isDone
                    ? styles.statusDone
                    : record.isScheduled
                    ? styles.statusScheduled
                    : styles.statusPending,
                ]}
              >
                <Text style={styles.statusText}>
                  {record.isDone
                    ? 'Completed'
                    : record.isScheduled
                    ? 'Scheduled'
                    : 'Pending'}
                </Text>
              </View>
            </View>
          </View>

          {record.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{record.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Status Update Modal */}
      {showStatusModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Status</Text>

            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.statusOption,
                  selectedStatus === option.value &&
                    styles.statusOptionSelected,
                ]}
                onPress={() => setSelectedStatus(option.value as any)}
              >
                <Text style={styles.statusOptionText}>{option.label}</Text>
                {selectedStatus === option.value && (
                  <View style={styles.statusOptionCheck} />
                )}
              </TouchableOpacity>
            ))}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowStatusModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleStatusChange}
              >
                <Text style={styles.confirmButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Delete Confirmation Modal */}
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
  editButtonText: {
    color: '#3B82F6',
    fontWeight: '500',
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusDone: {
    backgroundColor: '#D1FAE5',
  },
  statusScheduled: {
    backgroundColor: '#DBEAFE',
  },
  statusPending: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1F2937',
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
  statusOption: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusOptionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  statusOptionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  statusOptionCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 12,
    marginLeft: 8,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
  },
});
