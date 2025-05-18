import { Tabs } from 'expo-router';
import { Car, Wrench, Bell, User } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3B6FE0',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 60,
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
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Car size={size} color={color} />,
          headerTitle: 'My Vehicles',
        }}
      />
      <Tabs.Screen
        name="maintenance"
        options={{
          title: 'Maintenance',
          tabBarIcon: ({ color, size }) => <Wrench size={size} color={color} />,
          headerTitle: 'Maintenance Records',
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: 'Reminders',
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
          headerTitle: 'Service Reminders',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle: 'My Profile',
        }}
      />
    </Tabs>
  );
}