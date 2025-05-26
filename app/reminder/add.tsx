import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Switch,
  StyleSheet,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Check,
  Fuel,
  Wrench,
  Shield,
  FileText,
  Tag,
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Reminder } from '@/types';
import { useAddReminder } from '@/database/useAddReminder';
import { useUserVehicles } from '@/database/useFetchAllCarsById';
import { useStoredUser } from '@/hooks/useStoredData';

const REMINDER_TYPES = [
  {
    value: 'maintenance',
    label: 'Maintenance',
    icon: Wrench,
    color: '#3B82F6',
  },
  { value: 'fuel', label: 'Fuel', icon: Fuel, color: '#F59E0B' },
  { value: 'insurance', label: 'Insurance', icon: Shield, color: '#10B981' },
  { value: 'tax', label: 'Tax', icon: FileText, color: '#8B5CF6' },
  { value: 'other', label: 'Other', icon: Tag, color: '#6B7280' },
];

export default function AddReminderScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dueMileage, setDueMileage] = useState('');
  const [selectedType, setSelectedType] =
    useState<Reminder['type']>('maintenance');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState('90');
  const [recurringMileage, setRecurringMileage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { user } = useStoredUser();
  const { addReminder, loading } = useAddReminder();
  const { vehicles, loading: vehiclesLoading } = useUserVehicles();

  const handleSubmit = async () => {
    if (!title || !selectedVehicle) {
      setError('Please fill in all required fields');
      return;
    }

    if (dueMileage && isNaN(parseInt(dueMileage))) {
      setError('Please enter a valid mileage number');
      return;
    }

    if (isRecurring) {
      if (!recurringInterval && !recurringMileage) {
        setError('Please enter either a recurring interval or mileage');
        return;
      }
      if (recurringInterval && isNaN(parseInt(recurringInterval))) {
        setError('Please enter a valid recurring interval');
        return;
      }
      if (recurringMileage && isNaN(parseInt(recurringMileage))) {
        setError('Please enter a valid recurring mileage');
        return;
      }
    }

    try {
      const reminderData = {
        vehicleId: selectedVehicle,
        userid: user?.uuid,
        title,
        description,
        dueDate: dueDate.toISOString(),
        dueMileage: dueMileage ? parseInt(dueMileage) : undefined,
        type: selectedType,
        recurringInterval:
          isRecurring && recurringInterval
            ? parseInt(recurringInterval)
            : undefined,
        recurringMileage:
          isRecurring && recurringMileage
            ? parseInt(recurringMileage)
            : undefined,
      };

      const result = await addReminder(reminderData);

      if (result) {
        Alert.alert('Success', 'Reminder created successfully');
        router.back();
      }
    } catch (err) {
      //@ts-ignore
      setError(err.message || 'Failed to create reminder');
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const handleSelectVehicle = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Add Reminder',
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

            <View style={styles.typeSelector}>
              {REMINDER_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeOption,
                    selectedType === type.value && {
                      backgroundColor: type.color,
                      borderColor: type.color,
                    },
                  ]}
                  onPress={() =>
                    setSelectedType(type.value as Reminder['type'])
                  }
                >
                  <type.icon
                    size={20}
                    color={selectedType === type.value ? '#FFFFFF' : type.color}
                  />
                  <Text
                    style={[
                      styles.typeOptionText,
                      selectedType === type.value && { color: '#FFFFFF' },
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Oil Change"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Add any additional details"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Vehicle *</Text>
              {vehiclesLoading ? (
                <ActivityIndicator size="small" color="#3B82F6" />
              ) : (
                <View style={styles.vehicleList}>
                  {vehicles.map((vehicle) => (
                    <TouchableOpacity
                      key={vehicle.id}
                      style={[
                        styles.vehicleItem,
                        selectedVehicle === vehicle.id &&
                          styles.vehicleItemSelected,
                      ]}
                      onPress={() => handleSelectVehicle(vehicle.id)}
                    >
                      <Text style={styles.vehicleText}>
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </Text>
                      {selectedVehicle === vehicle.id && (
                        <Check size={20} color="#3B82F6" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
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
                placeholderTextColor="#9CA3AF"
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
                thumbColor={isRecurring ? '#3B82F6' : '#F3F4F6'}
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
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>OR repeat after (Kilometers)</Text>
                  <TextInput
                    style={styles.input}
                    value={recurringMileage}
                    onChangeText={setRecurringMileage}
                    placeholder="e.g., 5000"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>
              </>
            )}
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Create Reminder</Text>
            )}
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
  scrollView: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerButton: {
    padding: 8,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#B91C1C',
    textAlign: 'center',
    fontSize: 14,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  typeOptionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1F2937',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  vehicleList: {
    marginTop: 8,
  },
  vehicleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 8,
  },
  vehicleItemSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  vehicleText: {
    fontSize: 16,
    color: '#1F2937',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  datePickerText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
