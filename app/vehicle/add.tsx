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
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Camera,
  Upload,
  Car,
  Palette,
  FileText,
  Hash,
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);

export default function AddVehicleScreen() {
  const router = useRouter();
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(CURRENT_YEAR.toString());
  const [color, setColor] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [vin, setVin] = useState('');
  const [mileage, setMileage] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!make || !model || !year || !licensePlate || !mileage) {
      setError('Please fill in all required fields');
      return;
    }

    // Here you would typically make an API call to save the vehicle
    console.log('Saving vehicle:', {
      make,
      model,
      year: parseInt(year, 10),
      color,
      licensePlate,
      vin,
      mileage: parseInt(mileage, 10),
      purchaseDate,
      imageUrl: image,
    });

    router.back();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setPurchaseDate(selectedDate);
    }
  };

  const handleAddImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Add Vehicle',
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

          <View style={styles.imageSection}>
            {image ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: image }}
                  style={styles.vehicleImage}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.changeImageButton}
                  onPress={handleAddImage}
                >
                  <Text style={styles.changeImageText}>Change Photo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleAddImage}
              >
                <Upload size={24} color="#3B6FE0" />
                <Text style={styles.uploadButtonText}>Add Vehicle Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Vehicle Information</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Make *</Text>
              <TextInput
                style={styles.input}
                value={make}
                onChangeText={setMake}
                placeholder="e.g., Toyota"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Model *</Text>
              <TextInput
                style={styles.input}
                value={model}
                onChangeText={setModel}
                placeholder="e.g., Camry"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Year *</Text>
              <TextInput
                style={styles.input}
                value={year}
                onChangeText={setYear}
                placeholder={CURRENT_YEAR.toString()}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Color</Text>
              <TextInput
                style={styles.input}
                value={color}
                onChangeText={setColor}
                placeholder="e.g., Silver"
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Registration Details</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>License Plate *</Text>
              <TextInput
                style={styles.input}
                value={licensePlate}
                onChangeText={setLicensePlate}
                placeholder="e.g., ABC-1234"
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>VIN (Optional)</Text>
              <TextInput
                style={styles.input}
                value={vin}
                onChangeText={setVin}
                placeholder="Vehicle Identification Number"
                autoCapitalize="characters"
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Additional Information</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Current Mileage *</Text>
              <TextInput
                style={styles.input}
                value={mileage}
                onChangeText={setMileage}
                placeholder="e.g., 50000"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Purchase Date</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Calendar size={20} color="#6B7280" />
                <Text style={styles.datePickerText}>
                  {purchaseDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={purchaseDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Add Vehicle</Text>
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
  imageSection: {
    marginBottom: 16,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  vehicleImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  changeImageText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  uploadButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#3B6FE0',
    marginLeft: 8,
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
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
  },
  datePickerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 8,
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
