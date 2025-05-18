'use client';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Car,
  Fuel,
  Clock,
  Settings,
  MoreVertical,
  Wrench,
  Bell,
  DollarSign,
  ChevronRight,
  Shield,
  PlusCircle,
  MapPin,
  FileText,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Vehicle, MaintenanceRecord, FinancialRecord, Reminder } from '@/types';
import {
  MOCK_FINANCE,
  MOCK_MAINTENANCE,
  MOCK_REMINDERS,
  MOCK_VEHICLES,
} from '@/assets/MOCKDATA';

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
  const [finances, setFinances] = useState<FinancialRecord[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Get screen width to determine card sizes
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth - 32; // Full width with padding

  useEffect(() => {
    // Find vehicle by id
    const foundVehicle = MOCK_VEHICLES.find((v) => v.id === id);
    if (foundVehicle) {
      setVehicle(foundVehicle);

      // Filter related records
      setMaintenance(MOCK_MAINTENANCE.filter((m) => m.vehicleId === id));
      setFinances(MOCK_FINANCE.filter((f) => f.vehicleId === id));
      setReminders(MOCK_REMINDERS.filter((r) => r.vehicleId === id));
    }
  }, [id]);

  if (!vehicle) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderOverviewTab = () => (
    <>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Vehicle Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Make</Text>
          <Text style={styles.infoValue}>{vehicle.make}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Model</Text>
          <Text style={styles.infoValue}>{vehicle.model}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Year</Text>
          <Text style={styles.infoValue}>{vehicle.year}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Color</Text>
          <Text style={styles.infoValue}>{vehicle.color}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>License Plate</Text>
          <Text style={styles.infoValue}>{vehicle.licensePlate}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>VIN</Text>
          <Text style={styles.infoValue}>{vehicle.vin || 'Not provided'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Current Mileage</Text>
          <Text style={styles.infoValue}>
            {vehicle.mileage.toLocaleString()} miles
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Purchase Date</Text>
          <Text style={styles.infoValue}>
            {new Date(vehicle.purchaseDate).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.upcomingContainer}>
        <Text style={styles.sectionTitle}>Upcoming Maintenance</Text>
        {reminders.length > 0 ? (
          <View style={styles.upcomingCard}>
            {reminders.map((reminder) => (
              <View key={reminder.id} style={styles.upcomingItem}>
                <View style={styles.reminderIconContainer}>
                  <Bell size={20} color="#3B6FE0" />
                </View>
                <View style={styles.reminderInfo}>
                  <Text style={styles.reminderTitle}>{reminder.title}</Text>
                  <Text style={styles.reminderDue}>
                    Due: {new Date(reminder.dueDate).toLocaleDateString()}
                  </Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No upcoming maintenance</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/reminder/add')}
            >
              <Text style={styles.addButtonText}>Add Reminder</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.recentContainer}>
        <Text style={styles.sectionTitle}>Recent Records</Text>
        {maintenance.length > 0 ? (
          <View style={styles.recentCard}>
            {maintenance.slice(0, 2).map((record) => (
              <TouchableOpacity
                key={record.id}
                style={styles.recentItem}
                onPress={() => router.push(`/maintenance/${record.id}`)}
              >
                <View style={styles.recordIconContainer}>
                  <Wrench size={20} color="#3B6FE0" />
                </View>
                <View style={styles.recordInfo}>
                  <Text style={styles.recordTitle}>{record.title}</Text>
                  <Text style={styles.recordDate}>
                    {new Date(record.date).toLocaleDateString()} • $
                    {record.cost.toFixed(2)}
                  </Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => setActiveTab('maintenance')}
            >
              <Text style={styles.viewAllText}>View All Records</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No maintenance records</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/maintenance/add')}
            >
              <Text style={styles.addButtonText}>Add Record</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.financialSummary}>
        <Text style={styles.sectionTitle}>Financial Summary</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <DollarSign size={20} color="#3B6FE0" />
            <Text style={styles.statValue}>
              ${finances.reduce((sum, f) => sum + f.amount, 0).toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>Total Expenses</Text>
          </View>
          <View style={styles.statCard}>
            <Fuel size={20} color="#F59E0B" />
            <Text style={styles.statValue}>
              $
              {finances
                .filter((f) => f.type === 'fuel')
                .reduce((sum, f) => sum + f.amount, 0)
                .toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>Fuel Costs</Text>
          </View>
          <View style={styles.statCard}>
            <Wrench size={20} color="#EF4444" />
            <Text style={styles.statValue}>
              ${maintenance.reduce((sum, m) => sum + m.cost, 0).toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>Maintenance</Text>
          </View>
          <View style={styles.statCard}>
            <Shield size={20} color="#10B981" />
            <Text style={styles.statValue}>
              $
              {finances
                .filter((f) => f.type === 'insurance')
                .reduce((sum, f) => sum + f.amount, 0)
                .toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>Insurance</Text>
          </View>
        </View>
      </View>
    </>
  );

  const renderMaintenanceTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Maintenance Records</Text>

      <TouchableOpacity
        style={styles.addRecordButton}
        onPress={() => router.push('/maintenance/add')}
      >
        <PlusCircle size={20} color="#FFFFFF" />
        <Text style={styles.addRecordText}>Add Record</Text>
      </TouchableOpacity>

      {maintenance.length > 0 ? (
        maintenance.map((record) => (
          <TouchableOpacity
            key={record.id}
            style={styles.maintenanceCard}
            onPress={() => router.push(`/maintenance/${record.id}`)}
          >
            <View style={styles.maintenanceHeader}>
              <Wrench size={20} color="#3B6FE0" />
              <View style={styles.maintenanceInfo}>
                <Text style={styles.maintenanceTitle}>{record.title}</Text>
                <Text style={styles.maintenanceDate}>
                  {new Date(record.date).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.maintenanceCost}>
                ${record.cost.toFixed(2)}
              </Text>
            </View>
            {record.description && (
              <Text style={styles.maintenanceDescription}>
                {record.description}
              </Text>
            )}
            <View style={styles.maintenanceFooter}>
              <View style={styles.footerItem}>
                <Car size={16} color="#6B7280" />
                <Text style={styles.footerText}>
                  {record.mileage.toLocaleString()} miles
                </Text>
              </View>
              {record.location && (
                <View style={styles.footerItem}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.footerText}>{record.location}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No maintenance records yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Add your first maintenance record to start tracking
          </Text>
        </View>
      )}
    </View>
  );

  const renderFinancesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Financial Records</Text>

      <TouchableOpacity
        style={styles.addRecordButton}
        //@ts-ignore
        onPress={() => router.push('/finance/add')}
      >
        <PlusCircle size={20} color="#FFFFFF" />
        <Text style={styles.addRecordText}>Add Expense</Text>
      </TouchableOpacity>

      {finances.length > 0 ? (
        <>
          <View style={styles.financesSummary}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <Text style={styles.summaryAmount}>
                ${finances.reduce((sum, f) => sum + f.amount, 0).toFixed(2)}
              </Text>
            </View>
          </View>

          {finances.map((record) => (
            <TouchableOpacity
              key={record.id}
              style={styles.financeCard}
              //@ts-ignore
              onPress={() => router.push(`/finance/${record.id}`)}
            >
              <View style={styles.financeHeader}>
                {record.type === 'fuel' ? (
                  <View style={[styles.typeIcon, styles.fuelIcon]}>
                    <Fuel size={20} color="#FFFFFF" />
                  </View>
                ) : record.type === 'insurance' ? (
                  <View style={[styles.typeIcon, styles.insuranceIcon]}>
                    <Shield size={20} color="#FFFFFF" />
                  </View>
                ) : record.type === 'tax' ? (
                  <View style={[styles.typeIcon, styles.taxIcon]}>
                    <FileText size={20} color="#FFFFFF" />
                  </View>
                ) : (
                  <View style={[styles.typeIcon, styles.otherIcon]}>
                    <DollarSign size={20} color="#FFFFFF" />
                  </View>
                )}
                <View style={styles.financeInfo}>
                  <Text style={styles.financeType}>
                    {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                  </Text>
                  <Text style={styles.financeDate}>
                    {new Date(record.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.financeAmount}>
                  ${record.amount.toFixed(2)}
                </Text>
              </View>
              {record.description && (
                <Text style={styles.financeDescription}>
                  {record.description}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No financial records yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Add your first expense to start tracking your vehicle costs
          </Text>
        </View>
      )}
    </View>
  );

  const renderRemindersTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Service Reminders</Text>

      <TouchableOpacity
        style={styles.addRecordButton}
        onPress={() => router.push('/reminder/add')}
      >
        <PlusCircle size={20} color="#FFFFFF" />
        <Text style={styles.addRecordText}>Add Reminder</Text>
      </TouchableOpacity>

      {reminders.length > 0 ? (
        reminders.map((reminder) => (
          <TouchableOpacity
            key={reminder.id}
            style={styles.reminderCard}
            //@ts-ignore
            onPress={() => router.push(`/reminder/${reminder.id}`)}
          >
            <View style={styles.reminderHeader}>
              <Bell size={20} color="#3B6FE0" />
              <View style={styles.reminderInfoFull}>
                <Text style={styles.reminderTitleFull}>{reminder.title}</Text>
                <Text style={styles.reminderDate}>
                  Due: {new Date(reminder.dueDate).toLocaleDateString()}
                </Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>
            {reminder.description && (
              <Text style={styles.reminderDescription}>
                {reminder.description}
              </Text>
            )}
            {reminder.dueMileage && (
              <View style={styles.mileageBadge}>
                <Car size={14} color="#4B5563" />
                <Text style={styles.mileageText}>
                  {reminder.dueMileage.toLocaleString()} miles
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No service reminders yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Add reminders to get notified about upcoming services
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
          headerRight: () => (
            <TouchableOpacity style={styles.menuButton}>
              <MoreVertical size={24} color="#1F2937" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                vehicle.imageUrl ||
                'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg',
            }}
            style={styles.vehicleImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']}
            style={styles.gradient}
          />
          <View style={styles.imageOverlay}>
            <Text style={styles.vehicleName}>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </Text>
            <Text style={styles.licensePlate}>{vehicle.licensePlate}</Text>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabs}
          >
            <TouchableOpacity
              style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
              onPress={() => setActiveTab('overview')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'overview' && styles.activeTabText,
                ]}
              >
                Overview
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'maintenance' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('maintenance')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'maintenance' && styles.activeTabText,
                ]}
              >
                Maintenance
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'finances' && styles.activeTab]}
              onPress={() => setActiveTab('finances')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'finances' && styles.activeTabText,
                ]}
              >
                Finances
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'reminders' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('reminders')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'reminders' && styles.activeTabText,
                ]}
              >
                Reminders
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.contentContainer}>
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'maintenance' && renderMaintenanceTab()}
          {activeTab === 'finances' && renderFinancesTab()}
          {activeTab === 'reminders' && renderRemindersTab()}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  menuButton: {
    padding: 8,
  },
  imageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  vehicleName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  licensePlate: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B6FE0',
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B6FE0',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  infoValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1F2937',
  },
  upcomingContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 12,
  },
  upcomingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  upcomingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  reminderIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  reminderDue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#3B6FE0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  addButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  recentContainer: {
    marginBottom: 16,
  },
  recentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  recordIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recordInfo: {
    flex: 1,
  },
  recordTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  recordDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  viewAllButton: {
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3B6FE0',
  },
  financialSummary: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  statCard: {
    width: '50%',
    padding: 4,
  },
  statCardInner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1F2937',
    marginVertical: 8,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  // Tab content styles
  tabContent: {
    paddingBottom: 16,
  },
  tabTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 16,
  },
  addRecordButton: {
    backgroundColor: '#3B6FE0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addRecordText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  maintenanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  maintenanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  maintenanceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  maintenanceTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 2,
  },
  maintenanceDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  maintenanceCost: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1F2937',
  },
  maintenanceDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
  },
  maintenanceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  // Finance tab styles
  financesSummary: {
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1F2937',
  },
  financeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  financeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fuelIcon: {
    backgroundColor: '#F59E0B',
  },
  insuranceIcon: {
    backgroundColor: '#10B981',
  },
  taxIcon: {
    backgroundColor: '#8B5CF6',
  },
  otherIcon: {
    backgroundColor: '#6B7280',
  },
  financeInfo: {
    flex: 1,
  },
  financeType: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 2,
  },
  financeDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  financeAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1F2937',
  },
  financeDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
  },
  // Reminder tab styles
  reminderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reminderInfoFull: {
    flex: 1,
    marginLeft: 12,
  },
  reminderTitleFull: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 2,
  },
  reminderDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  reminderDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
  },
  mileageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  mileageText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#4B5563',
    marginLeft: 4,
  },
  // Empty state
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
});
