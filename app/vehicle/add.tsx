import { useLanguage } from '@/context/LanguageContext';
import { useAddVehicle } from '@/database/useAddVehicle';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Upload } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);

export default function AddVehicleScreen() {
  const router = useRouter();
  const { lang } = useLanguage();
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

  const {
    addVehicle,
    loading: saving,
    error: addVehicleError,
    userLoading,
  } = useAddVehicle();

  const handleSubmit = async () => {
    if (!make || !model || !year || !licensePlate || !mileage) {
      setError(
        lang === 'fr'
          ? 'Veuillez remplir tous les champs obligatoires'
          : lang === 'ara'
          ? 'يرجى ملء جميع الحقول المطلوبة'
          : 'Please fill in all required fields'
      );
      return;
    }

    if (userLoading) {
      setError(
        lang === 'fr'
          ? 'Les données utilisateur sont en cours de chargement, veuillez patienter'
          : lang === 'ara'
          ? 'بيانات المستخدم قيد التحميل، يرجى الانتظار'
          : 'User data is still loading, please wait'
      );
      return;
    }

    setError(null);

    try {
      const success = await addVehicle({
        make,
        model,
        year: parseInt(year, 10),
        color,
        licensePlate,
        vin,
        mileage: parseInt(mileage, 10),
        purchaseDate: purchaseDate.toISOString(),
        imageUri: image || undefined,
      });

      if (success) {
        router.back();
      } else {
        setError(
          addVehicleError || lang === 'fr'
            ? "Échec de l'enregistrement du véhicule"
            : lang === 'ara'
            ? 'فشل حفظ السيارة'
            : 'Failed to save vehicle'
        );
      }
    } catch (e) {
      console.error('Submission error:', e);
      setError(
        e instanceof Error
          ? e.message
          : lang === 'fr'
          ? "Échec de l'enregistrement du véhicule"
          : lang === 'ara'
          ? 'فشل حفظ السيارة'
          : 'Failed to save vehicle'
      );
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setPurchaseDate(selectedDate);
    }
  };

  const handleAddImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          lang === 'fr'
            ? 'Autorisation requise'
            : lang === 'ara'
            ? 'الإذن مطلوب'
            : 'Permission required',
          lang === 'fr'
            ? "L'accès à la galerie est nécessaire!"
            : lang === 'ara'
            ? 'مطلوب إذن للوصول إلى معرض الصور!'
            : 'Permission to access camera roll is required!'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      setError(
        lang === 'fr'
          ? "Échec de la sélection de l'image"
          : lang === 'ara'
          ? 'فشل اختيار الصورة'
          : 'Failed to select image'
      );
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle:
            lang === 'fr'
              ? 'Ajouter un véhicule'
              : lang === 'ara'
              ? 'إضافة سيارة'
              : 'Add Vehicle',
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
                  <Text style={styles.changeImageText}>
                    {lang === 'fr'
                      ? 'Changer la photo'
                      : lang === 'ara'
                      ? 'تغيير الصورة'
                      : 'Change Photo'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleAddImage}
              >
                <Upload size={24} color="#3B6FE0" />
                <Text style={styles.uploadButtonText}>
                  {lang === 'fr'
                    ? 'Ajouter une photo'
                    : lang === 'ara'
                    ? 'إضافة صورة السيارة'
                    : 'Add Vehicle Photo'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>
              {lang === 'fr'
                ? 'Informations du véhicule'
                : lang === 'ara'
                ? 'معلومات السيارة'
                : 'Vehicle Information'}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {lang === 'fr'
                  ? 'Marque *'
                  : lang === 'ara'
                  ? 'العلامة *'
                  : 'Make *'}
              </Text>
              <TextInput
                style={styles.input}
                value={make}
                onChangeText={setMake}
                placeholder={
                  lang === 'fr'
                    ? 'ex. Toyota'
                    : lang === 'ara'
                    ? 'مثال: تويوتا'
                    : 'e.g., Toyota'
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {lang === 'fr'
                  ? 'Modèle *'
                  : lang === 'ara'
                  ? 'الموديل *'
                  : 'Model *'}
              </Text>
              <TextInput
                style={styles.input}
                value={model}
                onChangeText={setModel}
                placeholder={
                  lang === 'fr'
                    ? 'ex. Camry'
                    : lang === 'ara'
                    ? 'مثال: كامري'
                    : 'e.g., Camry'
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {lang === 'fr'
                  ? 'Année *'
                  : lang === 'ara'
                  ? 'السنة *'
                  : 'Year *'}
              </Text>
              <TextInput
                style={styles.input}
                value={year}
                onChangeText={setYear}
                placeholder={CURRENT_YEAR.toString()}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {lang === 'fr' ? 'Couleur' : lang === 'ara' ? 'اللون' : 'Color'}
              </Text>
              <TextInput
                style={styles.input}
                value={color}
                onChangeText={setColor}
                placeholder={
                  lang === 'fr'
                    ? 'ex. Argent'
                    : lang === 'ara'
                    ? 'مثال: فضي'
                    : 'e.g., Silver'
                }
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>
              {lang === 'fr'
                ? "Détails d'immatriculation"
                : lang === 'ara'
                ? 'تفاصيل التسجيل'
                : 'Registration Details'}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {lang === 'fr'
                  ? "Plaque d'immatriculation *"
                  : lang === 'ara'
                  ? 'لوحة الترخيص *'
                  : 'License Plate *'}
              </Text>
              <TextInput
                style={styles.input}
                value={licensePlate}
                onChangeText={setLicensePlate}
                placeholder={
                  lang === 'fr'
                    ? 'ex. ABC-1234'
                    : lang === 'ara'
                    ? 'مثال: ABC-1234'
                    : 'e.g., ABC-1234'
                }
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {lang === 'fr'
                  ? 'VIN (Optionnel)'
                  : lang === 'ara'
                  ? 'رقم الهيكل (اختياري)'
                  : 'VIN (Optional)'}
              </Text>
              <TextInput
                style={styles.input}
                value={vin}
                onChangeText={setVin}
                placeholder={
                  lang === 'fr'
                    ? "Numéro d'identification du véhicule"
                    : lang === 'ara'
                    ? 'رقم تعريف السيارة'
                    : 'Vehicle Identification Number'
                }
                autoCapitalize="characters"
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>
              {lang === 'fr'
                ? 'Informations supplémentaires'
                : lang === 'ara'
                ? 'معلومات إضافية'
                : 'Additional Information'}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {lang === 'fr'
                  ? 'Kilométrage actuel *'
                  : lang === 'ara'
                  ? 'عدد الكيلومترات الحالي *'
                  : 'Current Mileage *'}
              </Text>
              <TextInput
                style={styles.input}
                value={mileage}
                onChangeText={setMileage}
                placeholder={
                  lang === 'fr'
                    ? 'ex. 50000'
                    : lang === 'ara'
                    ? 'مثال: 50000'
                    : 'e.g., 50000'
                }
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {lang === 'fr'
                  ? "Date d'achat"
                  : lang === 'ara'
                  ? 'تاريخ الشراء'
                  : 'Purchase Date'}
              </Text>
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

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                {lang === 'fr'
                  ? 'Ajouter le véhicule'
                  : lang === 'ara'
                  ? 'إضافة السيارة'
                  : 'Add Vehicle'}
              </Text>
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
  headerButton: {
    padding: 8,
    marginLeft: 8,
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
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
    fontWeight: 'bold',
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
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
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
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
