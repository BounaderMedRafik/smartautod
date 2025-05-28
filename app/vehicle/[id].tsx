'use client';
import { useLanguage } from '@/context/LanguageContext';
import { useDeleteVehicle } from '@/database/useDeleteVehicle';
import { useFetchCarById } from '@/database/useFetchCarById';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertTriangle,
  Bell,
  Car,
  ChevronRight,
  DollarSign,
  FileText,
  Fuel,
  MapPin,
  MoreVertical,
  PlusCircle,
  Shield,
  Trash2,
  Wrench,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams();
  const { lang, setLang } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deleteVehicle, isDeleting, error: DeleteError } = useDeleteVehicle();

  const { vehicle, maintenance, finances, reminders, loading, error, refetch } =
    useFetchCarById(id as string);

  const handleDelete = async () => {
    const success = await deleteVehicle(id as string);
    if (success) {
      router.replace('/');
    }
  };

  const getLatestMileage = () => {
    const maintenanceMileages = maintenance.map((m) => m.mileage);
    const allMileages = [...maintenanceMileages, vehicle?.mileage];
    //@ts-ignore
    return Math.max(...allMileages);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B6FE0" />
        <Text style={styles.loadingText}>
          {lang === 'fr'
            ? 'Chargement des détails du véhicule...'
            : lang === 'ara'
            ? 'جار تحميل تفاصيل السيارة...'
            : 'Loading vehicle details...'}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {lang === 'fr'
            ? 'Erreur lors du chargement du véhicule:'
            : lang === 'ara'
            ? 'خطأ في تحميل السيارة:'
            : 'Error loading vehicle:'}{' '}
          {error.message}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>
            {lang === 'fr'
              ? 'Réessayer'
              : lang === 'ara'
              ? 'إعادة المحاولة'
              : 'Retry'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {lang === 'fr'
            ? 'Véhicule non trouvé'
            : lang === 'ara'
            ? 'السيارة غير موجودة'
            : 'Vehicle not found'}
        </Text>
      </View>
    );
  }

  const renderOverviewTab = () => (
    <>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          {lang === 'fr'
            ? 'Informations sur le véhicule'
            : lang === 'ara'
            ? 'معلومات السيارة'
            : 'Vehicle Information'}
        </Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            {lang === 'fr' ? 'Marque' : lang === 'ara' ? 'العلامة' : 'Make'}
          </Text>
          <Text style={styles.infoValue}>{vehicle.make}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            {lang === 'fr' ? 'Modèle' : lang === 'ara' ? 'الموديل' : 'Model'}
          </Text>
          <Text style={styles.infoValue}>{vehicle.model}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            {lang === 'fr' ? 'Année' : lang === 'ara' ? 'السنة' : 'Year'}
          </Text>
          <Text style={styles.infoValue}>{vehicle.year}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            {lang === 'fr' ? 'Couleur' : lang === 'ara' ? 'اللون' : 'Color'}
          </Text>
          <Text style={styles.infoValue}>{vehicle.color}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            {lang === 'fr'
              ? "Plaque d'immatriculation"
              : lang === 'ara'
              ? 'لوحة الترخيص'
              : 'License Plate'}
          </Text>
          <Text style={styles.infoValue}>{vehicle.licensePlate}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            {lang === 'fr' ? 'VIN' : lang === 'ara' ? 'رقم الهيكل' : 'VIN'}
          </Text>
          <Text style={styles.infoValue}>
            {vehicle.vin ||
              (lang === 'fr'
                ? 'Non fourni'
                : lang === 'ara'
                ? 'غير متوفر'
                : 'Not provided')}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            {lang === 'fr'
              ? 'Kilométrage actuel'
              : lang === 'ara'
              ? 'عدد الكيلومترات الحالي'
              : 'Current Kilometrage'}
          </Text>
          <Text style={styles.infoValue}>
            {getLatestMileage().toLocaleString()}{' '}
            {lang === 'fr' ? 'km' : lang === 'ara' ? 'كم' : 'klms'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            {lang === 'fr'
              ? "Date d'achat"
              : lang === 'ara'
              ? 'تاريخ الشراء'
              : 'Purchase Date'}
          </Text>
          <Text style={styles.infoValue}>
            {new Date(vehicle.purchaseDate).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.upcomingContainer}>
        <Text style={styles.sectionTitle}>
          {lang === 'fr'
            ? 'Maintenance à venir'
            : lang === 'ara'
            ? 'الصيانة القادمة'
            : 'Upcoming Maintenance'}
        </Text>
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
                    {lang === 'fr' ? 'Dû:' : lang === 'ara' ? 'مستحق:' : 'Due:'}{' '}
                    {new Date(reminder.dueDate).toLocaleDateString()}
                  </Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              {lang === 'fr'
                ? 'Aucune maintenance prévue'
                : lang === 'ara'
                ? 'لا توجد صيانة قادمة'
                : 'No upcoming maintenance'}
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/reminder/add')}
            >
              <Text style={styles.addButtonText}>
                {lang === 'fr'
                  ? 'Ajouter un rappel'
                  : lang === 'ara'
                  ? 'إضافة تذكير'
                  : 'Add Reminder'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.recentContainer}>
        <Text style={styles.sectionTitle}>
          {lang === 'fr'
            ? 'Dossiers récents'
            : lang === 'ara'
            ? 'السجلات الحديثة'
            : 'Recent Records'}
        </Text>
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
                    {new Date(record.date).toLocaleDateString()} •
                    {record.cost
                      ? `DZD • ${record.cost}`
                      : lang === 'fr'
                      ? ' • Aucun coût'
                      : lang === 'ara'
                      ? ' • بدون تكلفة'
                      : ' • No cost'}
                  </Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => setActiveTab('maintenance')}
            >
              <Text style={styles.viewAllText}>
                {lang === 'fr'
                  ? 'Voir tous les dossiers'
                  : lang === 'ara'
                  ? 'عرض جميع السجلات'
                  : 'View All Records'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              {lang === 'fr'
                ? 'Aucun dossier de maintenance'
                : lang === 'ara'
                ? 'لا توجد سجلات صيانة'
                : 'No maintenance records'}
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/maintenance/add')}
            >
              <Text style={styles.addButtonText}>
                {lang === 'fr'
                  ? 'Ajouter un dossier'
                  : lang === 'ara'
                  ? 'إضافة سجل'
                  : 'Add Record'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );

  const renderMaintenanceTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>
        {lang === 'fr'
          ? 'Dossiers de maintenance'
          : lang === 'ara'
          ? 'سجلات الصيانة'
          : 'Maintenance Records'}
      </Text>

      <TouchableOpacity
        style={styles.addRecordButton}
        onPress={() => router.push('/maintenance/add')}
      >
        <PlusCircle size={20} color="#FFFFFF" />
        <Text style={styles.addRecordText}>
          {lang === 'fr'
            ? 'Ajouter un dossier'
            : lang === 'ara'
            ? 'إضافة سجل'
            : 'Add Record'}
        </Text>
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
                {record.cost
                  ? `DZD • ${record.cost}`
                  : lang === 'fr'
                  ? 'Aucun coût'
                  : lang === 'ara'
                  ? 'بدون تكلفة'
                  : 'No cost'}
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
                  {record.mileage.toLocaleString()}{' '}
                  {lang === 'fr' ? 'km' : lang === 'ara' ? 'كم' : 'miles'}
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
          <Text style={styles.emptyStateText}>
            {lang === 'fr'
              ? "Aucun dossier de maintenance pour l'instant"
              : lang === 'ara'
              ? 'لا توجد سجلات صيانة حتى الآن'
              : 'No maintenance records yet'}
          </Text>
          <Text style={styles.emptyStateSubtext}>
            {lang === 'fr'
              ? 'Ajoutez votre premier dossier de maintenance pour commencer le suivi'
              : lang === 'ara'
              ? 'أضف سجل الصيانة الأول لبدء التتبع'
              : 'Add your first maintenance record to start tracking'}
          </Text>
        </View>
      )}
    </View>
  );

  const renderFinancesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>
        {lang === 'fr'
          ? 'Dossiers financiers'
          : lang === 'ara'
          ? 'السجلات المالية'
          : 'Financial Records'}
      </Text>

      <TouchableOpacity
        style={styles.addRecordButton}
        onPress={() => router.push('/finance/add')}
      >
        <PlusCircle size={20} color="#FFFFFF" />
        <Text style={styles.addRecordText}>
          {lang === 'fr'
            ? 'Ajouter une dépense'
            : lang === 'ara'
            ? 'إضافة مصروف'
            : 'Add Expense'}
        </Text>
      </TouchableOpacity>

      {finances.length > 0 ? (
        <>
          <View style={styles.financesSummary}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>
                {lang === 'fr'
                  ? 'Dépenses totales'
                  : lang === 'ara'
                  ? 'إجمالي المصروفات'
                  : 'Total Expenses'}
              </Text>
              <Text style={styles.summaryAmount}>
                DZD • {finances.reduce((sum, f) => sum + Number(f.amount), 0)}
              </Text>
            </View>
          </View>

          {finances.map((record) => (
            <TouchableOpacity
              key={record.id}
              style={styles.financeCard}
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
                    {record.type === 'fuel'
                      ? lang === 'fr'
                        ? 'Carburant'
                        : lang === 'ara'
                        ? 'وقود'
                        : 'Fuel'
                      : record.type === 'insurance'
                      ? lang === 'fr'
                        ? 'Assurance'
                        : lang === 'ara'
                        ? 'تأمين'
                        : 'Insurance'
                      : record.type === 'tax'
                      ? lang === 'fr'
                        ? 'Taxe'
                        : lang === 'ara'
                        ? 'ضريبة'
                        : 'Tax'
                      : lang === 'fr'
                      ? 'Autre'
                      : lang === 'ara'
                      ? 'أخرى'
                      : 'Other'}
                  </Text>
                  <Text style={styles.financeDate}>
                    {new Date(record.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.financeAmount}>
                  DZD • {record.amount || 0}
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
          <Text style={styles.emptyStateText}>
            {lang === 'fr'
              ? "Aucun dossier financier pour l'instant"
              : lang === 'ara'
              ? 'لا توجد سجلات مالية حتى الآن'
              : 'No financial records yet'}
          </Text>
          <Text style={styles.emptyStateSubtext}>
            {lang === 'fr'
              ? 'Ajoutez votre première dépense pour commencer le suivi des coûts de votre véhicule'
              : lang === 'ara'
              ? 'أضف أول مصروف لبدء تتبع تكاليف سيارتك'
              : 'Add your first expense to start tracking your vehicle costs'}
          </Text>
        </View>
      )}
    </View>
  );

  const renderRemindersTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>
        {lang === 'fr'
          ? 'Rappels de service'
          : lang === 'ara'
          ? 'تذكيرات الخدمة'
          : 'Service Reminders'}
      </Text>

      <TouchableOpacity
        style={styles.addRecordButton}
        onPress={() => router.push('/reminder/add')}
      >
        <PlusCircle size={20} color="#FFFFFF" />
        <Text style={styles.addRecordText}>
          {lang === 'fr'
            ? 'Ajouter un rappel'
            : lang === 'ara'
            ? 'إضافة تذكير'
            : 'Add Reminder'}
        </Text>
      </TouchableOpacity>

      {reminders.length > 0 ? (
        reminders.map((reminder) => (
          <TouchableOpacity
            key={reminder.id}
            style={styles.reminderCard}
            onPress={() => router.push(`/reminder/${reminder.id}`)}
          >
            <View style={styles.reminderHeader}>
              <Bell size={20} color="#3B6FE0" />
              <View style={styles.reminderInfoFull}>
                <Text style={styles.reminderTitleFull}>{reminder.title}</Text>
                <Text style={styles.reminderDate}>
                  {lang === 'fr' ? 'Dû:' : lang === 'ara' ? 'مستحق:' : 'Due:'}{' '}
                  {new Date(reminder.dueDate).toLocaleDateString()}
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
                  {reminder.dueMileage.toLocaleString()}{' '}
                  {lang === 'fr' ? 'km' : lang === 'ara' ? 'كم' : 'miles'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {lang === 'fr'
              ? "Aucun rappel de service pour l'instant"
              : lang === 'ara'
              ? 'لا توجد تذكيرات خدمة حتى الآن'
              : 'No service reminders yet'}
          </Text>
          <Text style={styles.emptyStateSubtext}>
            {lang === 'fr'
              ? 'Ajoutez des rappels pour être notifié des prochains services'
              : lang === 'ara'
              ? 'أضف تذكيرات للحصول على إشعارات حول الخدمات القادمة'
              : 'Add reminders to get notified about upcoming services'}
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
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setShowDeleteConfirm(true)}
            >
              <Trash2 size={24} color="#EF4444" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {}}
            tintColor="#3B6FE0"
          />
        }
      >
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
                {lang === 'fr'
                  ? 'Aperçu'
                  : lang === 'ara'
                  ? 'نظرة عامة'
                  : 'Overview'}
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
                {lang === 'fr'
                  ? 'Maintenance'
                  : lang === 'ara'
                  ? 'الصيانة'
                  : 'Maintenance'}
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
                {lang === 'fr'
                  ? 'Finances'
                  : lang === 'ara'
                  ? 'المالية'
                  : 'Finances'}
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
                {lang === 'fr'
                  ? 'Rappels'
                  : lang === 'ara'
                  ? 'التذكيرات'
                  : 'Reminders'}
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

        {showDeleteConfirm && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <AlertTriangle size={32} color="#EF4444" />
              <Text style={styles.modalTitle}>
                {lang === 'fr'
                  ? 'Supprimer le véhicule?'
                  : lang === 'ara'
                  ? 'حذف السيارة؟'
                  : 'Delete Vehicle?'}
              </Text>
              <Text style={styles.modalMessage}>
                {lang === 'fr'
                  ? 'Cela supprimera définitivement le véhicule et tous ses enregistrements.'
                  : lang === 'ara'
                  ? 'سيؤدي هذا إلى حذف السيارة وجميع سجلاتها بشكل دائم.'
                  : 'This will permanently delete the vehicle and all its records.'}
              </Text>
              <Text style={styles.modalMessage}>{DeleteError}</Text>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowDeleteConfirm(false)}
                >
                  <Text style={styles.cancelButtonText}>
                    {lang === 'fr'
                      ? 'Annuler'
                      : lang === 'ara'
                      ? 'إلغاء'
                      : 'Cancel'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDelete}
                  disabled={isDeleting}
                >
                  <Text style={styles.deleteButtonText}>
                    {isDeleting
                      ? lang === 'fr'
                        ? 'Suppression...'
                        : lang === 'ara'
                        ? 'جاري الحذف...'
                        : 'Deleting...'
                      : lang === 'fr'
                      ? 'Supprimer'
                      : lang === 'ara'
                      ? 'حذف'
                      : 'Delete'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '85%',
  },
  modalIcon: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: '#3B6FE0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  licensePlate: {
    fontSize: 16,
    fontWeight: '500',
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
    fontSize: 16,
    fontWeight: '500',
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
    fontSize: 18,
    fontWeight: 'bold',
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
    fontSize: 16,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  upcomingContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  reminderDue: {
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
  // emptyText: {
  //   fontSize: 16,
  //   color: '#6B7280',
  //   marginBottom: 12,
  // },
  addButton: {
    backgroundColor: '#3B6FE0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  addButtonText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '500',
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
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  recordDate: {
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
    fontSize: 14,
    fontWeight: '500',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  tabContent: {
    paddingBottom: 16,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
    fontSize: 16,
    fontWeight: '500',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  maintenanceDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  maintenanceCost: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  maintenanceDescription: {
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
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
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
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  financeDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  financeAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  financeDescription: {
    fontSize: 14,
    color: '#4B5563',
  },
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  reminderDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  reminderDescription: {
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
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
    marginLeft: 4,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
});
