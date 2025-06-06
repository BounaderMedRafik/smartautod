import { useLanguage } from '@/context/LanguageContext';
import { loginUser } from '@/database/useLoginUser';
import { Link, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store'; // optional: for storing user data securely
import { Car, Lock, Mail } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
export default function LoginScreen() {
  const { lang } = useLanguage();
  useEffect(() => {
    const checkForUserSession = async () => {
      try {
        const userData = await SecureStore.getItemAsync('user');
        if (userData) {
          const user = JSON.parse(userData);

          router.replace({
            //@ts-ignore
            pathname: '(app)', // Or '(app)' if you want to go there
            //@ts-ignore
            params: { user },
          });
        }
      } catch (err) {
        console.error('Failed to restore session', err);
      }
    };

    checkForUserSession();
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError(
        lang === 'fr'
          ? 'Veuillez remplir tous les champs'
          : lang === 'ara'
          ? 'يرجى ملء جميع الحقول'
          : 'Please fill in all fields'
      );
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const user = await loginUser({ email, password });

      await SecureStore.setItemAsync('user', JSON.stringify(user));

      router.replace({
        //@ts-ignore
        pathname: '(app)',
        //@ts-ignore
        params: { user },
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : lang === 'fr'
          ? 'Échec de la connexion'
          : lang === 'ara'
          ? 'فشل تسجيل الدخول'
          : 'Failed to login'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    const demoEmail = 'user@example.com';
    const demoPassword = 'password123';

    setEmail(demoEmail);
    setPassword(demoPassword);
    setIsLoading(true);

    try {
      const user = await loginUser({
        email: demoEmail,
        password: demoPassword,
      });

      await SecureStore.setItemAsync('user', JSON.stringify(user));

      router.replace({
        //@ts-ignore
        pathname: 'profile',
        //@ts-ignore
        params: { user },
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : lang === 'fr'
          ? 'Échec de la connexion'
          : lang === 'ara'
          ? 'فشل تسجيل الدخول'
          : 'Failed to login'
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
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Car size={40} color="#3B6FE0" />
          </View>
          <Text style={styles.appName}>SmartAuto</Text>
          <Text style={styles.tagline}>
            {lang === 'fr'
              ? 'Gardez vos véhicules en parfait état'
              : lang === 'ara'
              ? 'الحفاظ على مركباتك في حالة مثالية'
              : 'Keeping your vehicles in perfect condition'}
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>
            {lang === 'fr'
              ? 'Se connecter'
              : lang === 'ara'
              ? 'تسجيل الدخول'
              : 'Sign In'}
          </Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

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

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>
                {lang === 'fr'
                  ? 'Se connecter'
                  : lang === 'ara'
                  ? 'تسجيل الدخول'
                  : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.links}>
            <Link href="/(auth)/forgot-password" asChild>
              <TouchableOpacity>
                <Text style={styles.forgotPassword}>
                  {lang === 'fr'
                    ? 'Mot de passe oublié?'
                    : lang === 'ara'
                    ? 'نسيت كلمة المرور؟'
                    : 'Forgot Password?'}
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>
              {lang === 'fr'
                ? "Vous n'avez pas de compte? "
                : lang === 'ara'
                ? 'ليس لديك حساب؟ '
                : "Don't have an account? "}
            </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.signupLink}>
                  {lang === 'fr'
                    ? "S'inscrire"
                    : lang === 'ara'
                    ? 'إنشاء حساب'
                    : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            </Link>
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
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
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
  loginButton: {
    backgroundColor: '#3B6FE0',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  demoButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  demoButtonText: {
    color: '#4B5563',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  links: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPassword: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3B6FE0',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  signupLink: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3B6FE0',
  },
});
