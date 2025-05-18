import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/context/AuthContext';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen once fonts are loaded or if there was an error
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // If fonts aren't loaded and there's no error, show a loading indicator
  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B6FE0" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="(auth)" 
          options={{ 
            headerShown: false,
            animation: 'fade',
          }} 
        />
        <Stack.Screen 
          name="(app)" 
          options={{ 
            headerShown: false,
            animation: 'fade',
          }} 
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});