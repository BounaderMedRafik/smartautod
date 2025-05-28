import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useLanguage } from '@/context/LanguageContext';
import { Stack } from 'expo-router/stack';

export default function AuthLayout() {
  const { lang, setLang } = useLanguage();

  // Cycle languages in order: eng -> fr -> ara -> eng -> ...
  const switchLanguage = () => {
    setLang(lang === 'eng' ? 'fr' : lang === 'fr' ? 'ara' : 'eng');
  };

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="signup"
          options={{
            title:
              lang === 'fr'
                ? "S'inscrire"
                : lang === 'ara'
                ? 'تسجيل'
                : 'Sign Up',
          }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{
            title:
              lang === 'fr'
                ? 'Réinitialiser le mot de passe'
                : lang === 'ara'
                ? 'إعادة تعيين كلمة المرور'
                : 'Reset Password',
          }}
        />
      </Stack>

      <View style={styles.floatingContainer}>
        <TouchableOpacity style={styles.button} onPress={switchLanguage}>
          <Text style={styles.buttonText}>{lang.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 999,
  },
  button: {
    backgroundColor: '#3B6FE0',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 18,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
