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
  DollarSign,
  Edit2,
  Trash2,
  AlertTriangle,
  Fuel,
  Shield,
  FileText,
  Tag,
} from 'lucide-react-native';
import { FinancialRecord, Vehicle } from '@/types';
import { MOCK_FINANCE, MOCK_VEHICLES } from '@/assets/MOCKDATA';

const getIconForType = (type: string) => {
  switch (type) {
    case 'fuel':
      return Fuel;
    case 'insurance':
      return Shield;
    case 'tax':
      return FileText;
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
    default:
      return '#6B7280';
  }
};

export default function FinanceDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [record, setRecord] = useState<FinancialRecord | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Find financial record by id
    const foundRecord = MOCK_FINANCE.find((f) => f.id === id);
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
    router.push(`/finance/edit/${id}`);
  };

  if (!record || !vehicle) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
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
                onPress={handleEdit}
                style={styles.headerButton}
              >
                <Edit2 size={24} color="#3B6FE0" />
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
            <View style={[styles.typeIcon, { backgroundColor: iconColor }]}>
              <IconComponent size={24} color="#FFFFFF" />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.amount}>${record.amount.toFixed(2)}</Text>
              <Text style={styles.type}>
                {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
              </Text>
            </View>
          </View>

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
              expense record?
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  amount: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1F2937',
    marginBottom: 4,
  },
  type: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#6B7280',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    marginBottom: 16,
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
