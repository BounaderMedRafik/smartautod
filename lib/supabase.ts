import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xwkjtnucfdiwadfwdwuq.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3a2p0bnVjZmRpd2FkZndkd3VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMzAwODIsImV4cCI6MjA2MjkwNjA4Mn0.1CBBYiyseg5X9eo-9f7Ls77wevABoMAlDZsVX0EDoV8';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
