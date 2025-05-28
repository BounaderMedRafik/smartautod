import { useAuth } from '@/context/AuthContext';
import { Bell, LogOut, Mail, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';

export default function ProfileScreen() {
  const { lang, setLang } = useLanguage();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user from SecureStore', error);
      }
    };

    loadUser();
  }, []);

  const handleSignOut = async () => {
    const signOutConfirmed =
      Platform.OS === 'web'
        ? confirm(
            lang === 'eng'
              ? 'Are you sure you want to sign out?'
              : lang === 'fr'
              ? 'Êtes-vous sûr de vouloir vous déconnecter ?'
              : 'هل أنت متأكد أنك تريد تسجيل الخروج؟'
          )
        : await new Promise<boolean>((resolve) =>
            Alert.alert(
              lang === 'eng'
                ? 'Sign Out'
                : lang === 'fr'
                ? 'Déconnexion'
                : 'تسجيل الخروج',
              lang === 'eng'
                ? 'Are you sure you want to sign out?'
                : lang === 'fr'
                ? 'Êtes-vous sûr de vouloir vous déconnecter ?'
                : 'هل أنت متأكد أنك تريد تسجيل الخروج؟',
              [
                {
                  text:
                    lang === 'eng'
                      ? 'Cancel'
                      : lang === 'fr'
                      ? 'Annuler'
                      : 'إلغاء',
                  style: 'cancel',
                  onPress: () => resolve(false),
                },
                {
                  text:
                    lang === 'eng'
                      ? 'Sign Out'
                      : lang === 'fr'
                      ? 'Se Déconnecter'
                      : 'تسجيل الخروج',
                  style: 'destructive',
                  onPress: () => resolve(true),
                },
              ]
            )
          );

    if (signOutConfirmed) {
      await SecureStore.deleteItemAsync('user');
      //@ts-ignore
      router.replace('/(auth)/');
    }
  };

  const toggleLang = () => {
    setLang(lang === 'eng' ? 'fr' : lang === 'fr' ? 'ara' : 'eng');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <User size={40} color="#3B6FE0" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>
              {user?.email || 'user@example.com'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {lang === 'eng'
            ? 'Notifications'
            : lang === 'fr'
            ? 'Notifications'
            : 'الإشعارات'}
        </Text>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Bell size={20} color="#4B5563" />
            <Text style={styles.settingText}>
              {lang === 'eng'
                ? 'Push Notifications'
                : lang === 'fr'
                ? 'Notifications Push'
                : 'إشعارات الدفع'}
            </Text>
          </View>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: '#D1D5DB', true: '#BFDBFE' }}
            thumbColor={pushNotifications ? '#3B6FE0' : '#F3F4F6'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Mail size={20} color="#4B5563" />
            <Text style={styles.settingText}>
              {lang === 'eng'
                ? 'Email Notifications'
                : lang === 'fr'
                ? 'Notifications Email'
                : 'إشعارات البريد الإلكتروني'}
            </Text>
          </View>
          <Switch
            value={emailNotifications}
            onValueChange={setEmailNotifications}
            trackColor={{ false: '#D1D5DB', true: '#BFDBFE' }}
            thumbColor={emailNotifications ? '#3B6FE0' : '#F3F4F6'}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.langToggleButton} onPress={toggleLang}>
        <Text style={styles.settingText}>
          {lang === 'eng'
            ? 'Switch to French'
            : lang === 'fr'
            ? 'Passer à l’arabe'
            : 'التحويل إلى الإنجليزية'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <LogOut size={20} color="#E03B3B" />
        <Text style={styles.signOutText}>
          {lang === 'eng'
            ? 'Sign Out'
            : lang === 'fr'
            ? 'Se Déconnecter'
            : 'تسجيل الخروج'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  langToggleButton: {
    marginVertical: 20,
    marginHorizontal: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#E5E7EB', // Light gray background
    borderRadius: 12,
    alignItems: 'center',
  },

  profileInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4B5563',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 12,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  signOutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#E03B3B',
    marginLeft: 8,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
});
