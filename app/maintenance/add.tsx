import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import {
  ArrowLeft,
  Camera,
  Calendar,
  Car,
  MapPin,
  DollarSign,
  ChevronDown,
  Upload,
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { MOCK_VEHICLES } from '@/assets/MOCKDATA';
import { useAddMaintenance } from '@/database/useAddMentenance';
import { useUserVehicles } from '@/database/useFetchAllCarsById';
import { Vehicle } from '@/types';
import { useStoredUser } from '@/hooks/useStoredData';

export default function AddMaintenanceScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mileage, setMileage] = useState('');
  const [cost, setCost] = useState('');
  const [location, setLocation] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isVehicleModalVisible, setIsVehicleModalVisible] = useState(false);
  const { user } = useStoredUser();
  const { addMaintenanceRecord, loading, error } = useAddMaintenance();
  const { vehicles, loading: vehiclesLoading } = useUserVehicles();

  const handleSubmit = async () => {
    if (!title || !selectedVehicle || !date || !mileage || !cost) {
      setFormError('Please fill in all required fields');
      return;
    }

    const record = {
      vehicleId: selectedVehicle,
      userid: user?.uuid,
      title,
      description,
      date: date.toISOString(),
      mileage: parseInt(mileage, 10),
      cost: parseFloat(cost),
      location,
      isScheduled: false,
      isDone: false,
    };

    const result = await addMaintenanceRecord(record);

    if (result) {
      router.back();
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSelectVehicle = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    setIsVehicleModalVisible(false);
  };

  const renderVehicleItem = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity
      style={styles.vehicleItem}
      onPress={() => handleSelectVehicle(item.id)}
    >
      <Text style={styles.vehicleItemText}>
        {item.year} {item.make} {item.model}
      </Text>
      {selectedVehicle === item.id && <View style={styles.selectedIndicator} />}
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Add Maintenance Record',
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
          {(formError || error) && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{formError || error}</Text>
            </View>
          )}

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Service Details</Text>

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
                onPress={() => setIsVehicleModalVisible(true)}
              >
                <Text style={styles.selectButtonText}>
                  {selectedVehicle && vehicles
                    ? `${vehicles.find((v) => v.id === selectedVehicle)?.year} 
                       ${vehicles.find((v) => v.id === selectedVehicle)?.make} 
                       ${vehicles.find((v) => v.id === selectedVehicle)?.model}`
                    : 'Select a vehicle'}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Service Information</Text>

            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color="#6B7280" />
              <Text style={styles.datePickerText}>
                {date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Kilometrage *</Text>
              <TextInput
                style={styles.input}
                value={mileage}
                onChangeText={setMileage}
                placeholder="e.g., 50000klm"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Cost *</Text>
              <TextInput
                style={styles.input}
                value={cost}
                onChangeText={setCost}
                placeholder="e.g., 500dzd"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="e.g., Quick Lube Service"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Save Record</Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Vehicle Selection Modal */}
        <Modal
          visible={isVehicleModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsVehicleModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Vehicle</Text>
                <TouchableOpacity
                  onPress={() => setIsVehicleModalVisible(false)}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </View>

              {vehiclesLoading ? (
                <ActivityIndicator size="large" color="#3B6FE0" />
              ) : (
                <FlatList
                  data={vehicles}
                  renderItem={renderVehicleItem}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.vehicleList}
                />
              )}
            </View>
          </View>
        </Modal>
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
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 24,
    backgroundColor: '#F9FAFB',
  },
  uploadButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#3B6FE0',
    marginLeft: 8,
  },
  receiptContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  receiptImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  changeReceiptButton: {
    marginTop: 8,
    alignSelf: 'center',
  },
  changeReceiptText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3B6FE0',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#3B6FE0',
  },
  vehicleList: {
    paddingBottom: 16,
  },
  vehicleItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleItemText: {
    fontSize: 16,
    color: '#1F2937',
  },
  selectedIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B6FE0',
  },
});
