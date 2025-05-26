import { useDeleteFinancialRecord } from '@/database/useDeleteFinance';
import { supabase } from '@/lib/supabase';
import { FinancialRecord, Vehicle } from '@/types';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Car,
  FileText,
  Fuel,
  Shield,
  Tag,
  Trash2,
  Wrench,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function FinanceDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [record, setRecord] = useState<FinancialRecord | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { deleteFinancialRecord } = useDeleteFinancialRecord();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch financial record
        const { data: financeData, error: financeError } = await supabase
          .from('finances')
          .select('*')
          .eq('id', id)
          .single();

        if (financeError) throw financeError;
        setRecord(financeData);

        // Fetch associated vehicle
        if (financeData?.vehicleId) {
          const { data: vehicleData, error: vehicleError } = await supabase
            .from('cars')
            .select('*')
            .eq('id', financeData.vehicleId)
            .single();

          if (vehicleError) throw vehicleError;
          setVehicle(vehicleData);
        }
      } catch (err) {
        //@ts-ignore
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    const success = await deleteFinancialRecord(id as string);
    if (success) {
      setShowDeleteConfirm(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'fuel':
        return Fuel;
      case 'insurance':
        return Shield;
      case 'tax':
        return FileText;
      case 'maintenance':
        return Wrench;
      default:
        return Tag;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'fuel':
        return '#F59E0B';
      case 'insurance':
        return '#10B981';
      case 'tax':
        return '#8B5CF6';
      case 'maintenance':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading expense details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
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

  const IconComponent = getIconForType(record.type);
  const iconColor = getColorForType(record.type);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Expense Details',
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
          {/* Expense Header */}
          <View style={styles.header}>
            <View style={[styles.typeIcon, { backgroundColor: iconColor }]}>
              <IconComponent size={24} color="#FFFFFF" />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.amount}>${record.amount}</Text>
              <Text style={styles.type}>
                {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
              </Text>
            </View>
          </View>

          {/* Basic Details */}
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Calendar size={20} color="#6B7280" />
                <View style={styles.detailText}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>
                    {new Date(record.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View style={styles.detailItem}>
                <Car size={20} color="#6B7280" />
                <View style={styles.detailText}>
                  <Text style={styles.detailLabel}>Vehicle</Text>
                  <Text style={styles.detailValue}>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Description */}
          {record.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{record.description}</Text>
            </View>
          )}

          {/* Additional Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Created At</Text>
              <Text style={styles.infoValue}>
                {new Date(record.date).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <AlertTriangle size={32} color="#EF4444" />
            </View>
            <Text style={styles.modalTitle}>Delete Expense?</Text>
            <Text style={styles.modalMessage}>
              This will permanently delete this expense record. This action
              cannot be undone.
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
  loadingText: {
    marginTop: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  typeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  amount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  type: {
    fontSize: 18,
    color: '#6B7280',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  receiptImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  viewReceiptButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    alignItems: 'center',
  },
  viewReceiptText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#6B7280',
  },
  infoValue: {
    color: '#1F2937',
    fontWeight: '500',
  },
  headerButton: {
    padding: 8,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '100%',
  },
  modalIcon: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#4B5563',
    textAlign: 'center',
    fontWeight: '500',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#EF4444',
    textAlign: 'center',
    fontWeight: '500',
  },
});
