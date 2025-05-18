import { Stack } from 'expo-router/stack';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="forgot-password" options={{ title: 'Reset Password' }} />
    </Stack>
  );
}