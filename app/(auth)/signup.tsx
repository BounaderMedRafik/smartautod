import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import * as SecureStore from 'expo-secure-store';
import { checkForUserInDB } from '@/database/useCheckForUserInDB';
import { signUpUser } from '@/database/signUpUser';
import { useLanguage } from '@/context/LanguageContext';

export default function SignupScreen() {
  const { lang } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError(
        lang === 'fr'
          ? 'Veuillez remplir tous les champs'
          : lang === 'ara'
          ? 'يرجى ملء جميع الحقول'
          : 'Please fill in all fields'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        lang === 'fr'
          ? 'Les mots de passe ne correspondent pas'
          : lang === 'ara'
          ? 'كلمات المرور غير متطابقة'
          : 'Passwords do not match'
      );
      return;
    }

    if (password.length < 8) {
      setError(
        lang === 'fr'
          ? 'Le mot de passe doit contenir au moins 8 caractères'
          : lang === 'ara'
          ? 'يجب أن تكون كلمة المرور 8 أحرف على الأقل'
          : 'Password must be at least 8 characters'
      );
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const userExists = await checkForUserInDB(email);

      if (userExists) {
        Alert.alert(
          lang === 'fr'
            ? "L'utilisateur existe déjà"
            : lang === 'ara'
            ? 'المستخدم موجود بالفعل'
            : 'User already exists',
          lang === 'fr'
            ? 'Essayez de vous connecter.'
            : lang === 'ara'
            ? 'حاول تسجيل الدخول بدلاً من ذلك.'
            : 'Try logging in instead.'
        );
        return;
      }

      const age = '18'; // Default or placeholder, adjust as needed

      await signUpUser({ name, age, email, password });

      Alert.alert(
        lang === 'fr'
          ? 'Inscription réussie'
          : lang === 'ara'
          ? 'تم التسجيل بنجاح'
          : 'Signed up successfully',
        lang === 'fr'
          ? 'Vous pouvez maintenant vous connecter.'
          : lang === 'ara'
          ? 'يمكنك الآن تسجيل الدخول.'
          : 'You can now log in.'
      );

      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      router.replace({
        //@ts-ignore
        pathname: 'profile',
        //@ts-ignore
        params: { user: { name, email, age } },
      });
    } catch (err: any) {
      setError(
        err.message ||
          (lang === 'fr'
            ? "L'inscription a échoué"
            : lang === 'ara'
            ? 'فشل التسجيل'
            : 'Signup failed')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <Text style={styles.title}>
            {lang === 'fr'
              ? 'Créer un compte'
              : lang === 'ara'
              ? 'إنشاء حساب'
              : 'Create Account'}
          </Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <User size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={
                lang === 'fr'
                  ? 'Nom complet'
                  : lang === 'ara'
                  ? 'الاسم الكامل'
                  : 'Full Name'
              }
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Mail size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={
                lang === 'fr'
                  ? 'Email'
                  : lang === 'ara'
                  ? 'البريد الإلكتروني'
                  : 'Email'
              }
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={
                lang === 'fr'
                  ? 'Mot de passe'
                  : lang === 'ara'
                  ? 'كلمة المرور'
                  : 'Password'
              }
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={
                lang === 'fr'
                  ? 'Confirmer le mot de passe'
                  : lang === 'ara'
                  ? 'تأكيد كلمة المرور'
                  : 'Confirm Password'
              }
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signupButtonText}>
                {lang === 'fr'
                  ? 'Créer un compte'
                  : lang === 'ara'
                  ? 'إنشاء حساب'
                  : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              {lang === 'fr'
                ? 'Vous avez déjà un compte? '
                : lang === 'ara'
                ? 'هل لديك حساب بالفعل؟ '
                : 'Already have an account? '}
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginLink}>
                {lang === 'fr'
                  ? 'Se connecter'
                  : lang === 'ara'
                  ? 'تسجيل الدخول'
                  : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 24,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 16,
    height: 48,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
  },
  signupButton: {
    backgroundColor: '#3B6FE0',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3B6FE0',
  },
});
