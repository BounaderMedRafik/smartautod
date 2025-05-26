import { useAddFinancialRecord } from '@/database/useAddFinancialRecord';
import { useUserVehicles } from '@/database/useFetchAllCarsById';
import { Vehicle } from '@/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  FileText,
  Fuel,
  Shield,
  Tag,
  Wrench,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AddFinanceScreen() {
  const router = useRouter();
  const [type, setType] = useState<
    'fuel' | 'insurance' | 'tax' | 'maintenance' | 'other'
  >('fuel');
  const [amount, setAmount] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState('');
  const [receipt, setReceipt] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isVehicleModalVisible, setIsVehicleModalVisible] = useState(false);

  const { addFinancialRecord, loading, error } = useAddFinancialRecord();
  const { vehicles, loading: vehiclesLoading } = useUserVehicles();

  const handleSubmit = async () => {
    if (!selectedVehicle || !amount) {
      setFormError('Please fill in all required fields');
      return;
    }

    const record = {
      vehicleId: selectedVehicle,
      type,
      amount: parseFloat(amount),
      date: date.toISOString(),
      description,
      receipt: receipt || undefined,
    };

    const result = await addFinancialRecord(record);

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

  const typeOptions = [
    { value: 'fuel', label: 'Fuel', icon: Fuel, color: '#F59E0B' },
    { value: 'insurance', label: 'Insurance', icon: Shield, color: '#10B981' },
    { value: 'tax', label: 'Tax', icon: FileText, color: '#8B5CF6' },
    {
      value: 'maintenance',
      label: 'Maintenance',
      icon: Wrench,
      color: '#3B82F6',
    },
    { value: 'other', label: 'Other', icon: Tag, color: '#6B7280' },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Add Expense Record',
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
            <Text style={styles.sectionTitle}>Expense Type</Text>

            <View style={styles.typeSelector}>
              {typeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.typeOption,
                    type === option.value && {
                      backgroundColor: option.color,
                      borderColor: option.color,
                    },
                  ]}
                  onPress={() => setType(option.value as any)}
                >
                  <option.icon
                    size={20}
                    color={type === option.value ? '#FFFFFF' : option.color}
                  />
                  <Text
                    style={[
                      styles.typeOptionText,
                      type === option.value && { color: '#FFFFFF' },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Expense Details</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Amount *</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="e.g., 49.99"
                keyboardType="decimal-pad"
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
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Save Expense</Text>
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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginBottom: 16,
  },
  typeButton: {
    width: '50%',
    padding: 4,
  },
  typeButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
  },
  typeButtonActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#3B6FE0',
  },
  typeButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  typeButtonTextActive: {
    color: '#3B6FE0',
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
  vehicleItem: {
    padding: 16,
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
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
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
    padding: 16,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
  },
  vehicleList: {
    paddingBottom: 32,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  currencySymbol: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#6B7280',
    paddingLeft: 12,
  },
  amountInput: {
    flex: 1,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
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
});
