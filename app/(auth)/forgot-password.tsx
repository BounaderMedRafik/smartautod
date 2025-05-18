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
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, ArrowLeft } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setError(null);
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
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
          {!isSubmitted ? (
            <>
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>
                Enter your email address, and we'll send you instructions to reset your password.
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
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Send Instructions</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.successContainer}>
                <Mail size={48} color="#3B6FE0" />
                <Text style={styles.successTitle}>Check Your Email</Text>
                <Text style={styles.successMessage}>
                  We've sent password reset instructions to {email}
                </Text>
                <TouchableOpacity 
                  style={styles.backToLoginButton} 
                  onPress={() => router.push('/(auth)')}
                >
                  <Text style={styles.backToLoginText}>Back to Login</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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
  submitButton: {
    backgroundColor: '#3B6FE0',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  successContainer: {
    alignItems: 'center',
    padding: 16,
  },
  successTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  backToLoginButton: {
    backgroundColor: '#3B6FE0',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  backToLoginText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
});