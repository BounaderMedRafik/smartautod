import { useLanguage } from '@/context/LanguageContext';
import { Tabs } from 'expo-router';
import { Bell, Car, User, Wrench } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function AppLayout() {
  const { lang } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3B6FE0',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 88,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        },
        headerTitleStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 18,
          color: '#1F2937',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title:
            lang === 'eng'
              ? 'Dashboard'
              : lang === 'fr'
              ? 'Tableau de bord'
              : 'لوحة القيادة',
          tabBarIcon: ({ color, size }) => <Car size={size} color={color} />,
          headerTitle:
            lang === 'eng'
              ? 'My Vehicles'
              : lang === 'fr'
              ? 'Mes véhicules'
              : 'مركباتي',
        }}
      />
      <Tabs.Screen
        name="maintenance"
        options={{
          title:
            lang === 'eng'
              ? 'Maintenance'
              : lang === 'fr'
              ? 'Entretien'
              : 'الصيانة',
          tabBarIcon: ({ color, size }) => <Wrench size={size} color={color} />,
          headerTitle:
            lang === 'eng'
              ? 'Maintenance Records'
              : lang === 'fr'
              ? 'Historique d’entretien'
              : 'سجلات الصيانة',
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title:
            lang === 'eng'
              ? 'Reminders'
              : lang === 'fr'
              ? 'Rappels'
              : 'التذكيرات',
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
          headerTitle:
            lang === 'eng'
              ? 'Service Reminders'
              : lang === 'fr'
              ? 'Rappels de service'
              : 'تذكيرات الخدمة',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title:
            lang === 'eng'
              ? 'Profile'
              : lang === 'fr'
              ? 'Profil'
              : 'الملف الشخصي',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle:
            lang === 'eng'
              ? 'My Profile'
              : lang === 'fr'
              ? 'Mon profil'
              : 'ملفي الشخصي',
        }}
      />
    </Tabs>
  );
}
