import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Car,
  Bell,
  Edit2,
  Trash2,
  AlertTriangle,
  Clock,
} from 'lucide-react-native';
import { Reminder, Vehicle } from '@/types';
import { MOCK_REMINDERS, MOCK_VEHICLES } from '@/assets/MOCKDATA';

export default function ReminderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Find reminder by id
    const foundReminder = MOCK_REMINDERS.find((r) => r.id === id);
    if (foundReminder) {
      setReminder(foundReminder);
      // Find associated vehicle
      const foundVehicle = MOCK_VEHICLES.find(
        (v) => v.id === foundReminder.vehicleId
      );
      if (foundVehicle) {
        setVehicle(foundVehicle);
      }
    }
  }, [id]);

  const handleDelete = () => {
    // Here you would typically make an API call to delete the reminder
    console.log('Deleting reminder:', id);
    router.back();
  };

  const handleEdit = () => {
    router.push(`/reminder/edit/${id}`);
  };

  const handleComplete = () => {
    if (reminder) {
      setReminder({ ...reminder, isComplete: !reminder.isComplete });
    }
  };

  if (!reminder || !vehicle) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const daysUntilDue = Math.ceil(
    (new Date(reminder.dueDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const getStatusColor = () => {
    if (reminder.isComplete) return '#10B981';
    if (daysUntilDue < 0) return '#EF4444';
    if (daysUntilDue < 7) return '#F59E0B';
    return '#6B7280';
  };

  const getStatusText = () => {
    if (reminder.isComplete) return 'Completed';
    if (daysUntilDue < 0) return 'Overdue';
    if (daysUntilDue === 0) return 'Due today';
    if (daysUntilDue === 1) return 'Due tomorrow';
    return `Due in ${daysUntilDue} days`;
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Reminder Details',
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
            <View style={styles.titleSection}>
              <Bell size={24} color="#3B6FE0" />
              <View style={styles.titleInfo}>
                <Text style={styles.title}>{reminder.title}</Text>
                <Text style={styles.vehicleName}>
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor() + '20' },
              ]}
              onPress={handleComplete}
            >
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {getStatusText()}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Calendar size={20} color="#6B7280" />
                <View style={styles.detailText}>
                  <Text style={styles.detailLabel}>Due Date</Text>
                  <Text style={styles.detailValue}>
                    {new Date(reminder.dueDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              {reminder.dueMileage && (
                <View style={styles.detailItem}>
                  <Car size={20} color="#6B7280" />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Due Mileage</Text>
                    <Text style={styles.detailValue}>
                      {reminder.dueMileage.toLocaleString()} mi
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {(reminder.recurringInterval || reminder.recurringMileage) && (
              <View style={[styles.detailRow, styles.recurringSection]}>
                <View style={styles.recurringHeader}>
                  <Clock size={20} color="#6B7280" />
                  <Text style={styles.recurringTitle}>Recurring Settings</Text>
                </View>
                {reminder.recurringInterval && (
                  <Text style={styles.recurringText}>
                    Repeats every {reminder.recurringInterval} days
                  </Text>
                )}
                {reminder.recurringMileage && (
                  <Text style={styles.recurringText}>
                    Repeats every {reminder.recurringMileage.toLocaleString()}{' '}
                    miles
                  </Text>
                )}
              </View>
            )}
          </View>

          {reminder.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{reminder.description}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.completeButton,
              reminder.isComplete && styles.uncompleteButton,
            ]}
            onPress={handleComplete}
          >
            <Text
              style={[
                styles.completeButtonText,
                reminder.isComplete && styles.uncompleteButtonText,
              ]}
            >
              {reminder.isComplete ? 'Mark as Incomplete' : 'Mark as Complete'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showDeleteConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <AlertTriangle size={32} color="#EF4444" />
            </View>
            <Text style={styles.modalTitle}>Delete Reminder?</Text>
            <Text style={styles.modalMessage}>
              This action cannot be undone. Are you sure you want to delete this
              reminder?
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
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleInfo: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 4,
  },
  vehicleName: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
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
  recurringSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  recurringHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recurringTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 8,
  },
  recurringText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 28,
    marginTop: 4,
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
  completeButton: {
    backgroundColor: '#3B6FE0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  completeButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  uncompleteButton: {
    backgroundColor: '#F3F4F6',
  },
  uncompleteButtonText: {
    color: '#4B5563',
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
