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
  Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Car,
  DollarSign,
  ChevronDown,
  Upload,
  Fuel,
  Shield,
  FileText,
  Tag,
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Vehicle } from '@/types';
import { EXPENSE_TYPES, MOCK_VEHICLES } from '@/assets/MOCKDATA';

export default function AddFinanceScreen() {
  const router = useRouter();
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [amount, setAmount] = useState('');
  const [receipt, setReceipt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!type || !selectedVehicle || !date || !amount) {
      setError('Please fill in all required fields');
      return;
    }

    // Here you would typically make an API call to save the financial record
    console.log('Saving financial record:', {
      type,
      description,
      vehicleId: selectedVehicle,
      date,
      amount: parseFloat(amount),
      receipt,
    });

    router.back();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSelectVehicle = () => {
    Alert.alert(
      'Select Vehicle',
      '',
      MOCK_VEHICLES.map((vehicle) => ({
        text: `${vehicle.make} ${vehicle.model}`,
        onPress: () => setSelectedVehicle(vehicle.id),
      })),
      { cancelable: true }
    );
  };

  const handleAddReceipt = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setReceipt(result.assets[0].uri);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Add Expense',
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
            <Text style={styles.sectionTitle}>Expense Type</Text>

            <View style={styles.typeGrid}>
              {EXPENSE_TYPES.map((expenseType) => (
                <TouchableOpacity
                  key={expenseType.id}
                  style={[
                    styles.typeButton,
                    type === expenseType.id && styles.typeButtonActive,
                  ]}
                  onPress={() => setType(expenseType.id)}
                >
                  <expenseType.icon
                    size={24}
                    color={type === expenseType.id ? '#3B6FE0' : '#6B7280'}
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === expenseType.id && styles.typeButtonTextActive,
                    ]}
                  >
                    {expenseType.label}
                  </Text>
                </TouchableOpacity>
              ))}
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
                onPress={handleSelectVehicle}
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
            <Text style={styles.sectionTitle}>Expense Details</Text>

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
              <Text style={styles.label}>Amount *</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>DZD</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Receipt</Text>

            {receipt ? (
              <View style={styles.receiptContainer}>
                <Image
                  source={{ uri: receipt }}
                  style={styles.receiptImage}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.changeReceiptButton}
                  onPress={handleAddReceipt}
                >
                  <Text style={styles.changeReceiptText}>Change Receipt</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleAddReceipt}
              >
                <Upload size={24} color="#3B6FE0" />
                <Text style={styles.uploadButtonText}>Upload Receipt</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Save Expense</Text>
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
