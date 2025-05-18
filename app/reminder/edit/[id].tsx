import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Car,
  Bell,
  Clock,
  ChevronDown,
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Reminder, Vehicle } from '@/types';

// Mock data
const MOCK_VEHICLES = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
  },
  {
    id: '2',
    make: 'Honda',
    model: 'CR-V',
    year: 2018,
  },
];

const MOCK_REMINDERS: Reminder[] = [
  {
    id: '1',
    vehicleId: '1',
    title: 'Oil Change',
    description: 'Regular 5,000 mile oil change service',
    dueDate: '2023-11-30',
    dueMileage: 17500,
    type: 'maintenance',
    isComplete: false,
    recurringInterval: 90,
    recurringMileage: 5000,
  },
];

export default function EditReminderScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dueMileage, setDueMileage] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState('');
  const [recurringMileage, setRecurringMileage] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Find reminder by id
    const reminder = MOCK_REMINDERS.find((r) => r.id === id);
    if (reminder) {
      setTitle(reminder.title);
      setDescription(reminder.description || '');
      setSelectedVehicle(reminder.vehicleId);
      setDueDate(new Date(reminder.dueDate));
      setDueMileage(reminder.dueMileage?.toString() || '');
      setIsRecurring(
        !!reminder.recurringInterval || !!reminder.recurringMileage
      );
      setRecurringInterval(reminder.recurringInterval?.toString() || '');
      setRecurringMileage(reminder.recurringMileage?.toString() || '');
    }
  }, [id]);

  const handleSubmit = () => {
    if (!title || !selectedVehicle || !dueDate) {
      setError('Please fill in all required fields');
      return;
    }

    // Here you would typically make an API call to update the reminder
    console.log('Updating reminder:', {
      id,
      title,
      description,
      vehicleId: selectedVehicle,
      dueDate,
      dueMileage: dueMileage ? parseInt(dueMileage, 10) : undefined,
      isRecurring,
      recurringInterval: recurringInterval
        ? parseInt(recurringInterval, 10)
        : undefined,
      recurringMileage: recurringMileage
        ? parseInt(recurringMileage, 10)
        : undefined,
    });

    router.back();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Edit Reminder',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <ArrowLeft size={24} color="#1F2937" />
            </TouchableOpacity>
          ),
        }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Reminder Details</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Oil Change"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Add any additional details"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Vehicle *</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => {
                  /* Show vehicle selector */
                }}
              >
                <Text style={styles.selectButtonText}>
                  {selectedVehicle
                    ? MOCK_VEHICLES.find((v) => v.id === selectedVehicle)
                        ?.make +
                      ' ' +
                      MOCK_VEHICLES.find((v) => v.id === selectedVehicle)?.model
                    : 'Select a vehicle'}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Due Date & Mileage</Text>

            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color="#6B7280" />
              <Text style={styles.datePickerText}>
                {dueDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dueDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Due Mileage</Text>
              <TextInput
                style={styles.input}
                value={dueMileage}
                onChangeText={setDueMileage}
                placeholder="e.g., 50000"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Recurring Settings</Text>

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>
                Make this a recurring reminder
              </Text>
              <Switch
                value={isRecurring}
                onValueChange={setIsRecurring}
                trackColor={{ false: '#D1D5DB', true: '#BFDBFE' }}
                thumbColor={isRecurring ? '#3B6FE0' : '#F3F4F6'}
              />
            </View>

            {isRecurring && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Repeat every (days)</Text>
                  <TextInput
                    style={styles.input}
                    value={recurringInterval}
                    onChangeText={setRecurringInterval}
                    placeholder="e.g., 90"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Repeat every (miles)</Text>
                  <TextInput
                    style={styles.input}
                    value={recurringMileage}
                    onChangeText={setRecurringMileage}
                    placeholder="e.g., 5000"
                    keyboardType="numeric"
                  />
                </View>
              </>
            )}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#B91C1C',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  formSection: {
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
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
  },
  selectButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 16,
  },
  datePickerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  switchLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#4B5563',
  },
  submitButton: {
    backgroundColor: '#3B6FE0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  submitButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
