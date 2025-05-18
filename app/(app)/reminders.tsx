import { MOCK_REMINDERS, MOCK_VEHICLES } from '@/assets/MOCKDATA';
import { Reminder } from '@/types';
import { useRouter } from 'expo-router';
import {
  AlertCircle,
  BellOff,
  Calendar,
  Clock,
  Leaf,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const getIconForType = (
  type: string,
  size: number = 20,
  color: string = '#3B6FE0'
) => {
  switch (type) {
    case 'maintenance':
      return <Leaf size={size} color={color} />;
    case 'insurance':
      return <ShieldCheck size={size} color={color} />;
    case 'tax':
      return <Clock size={size} color={color} />;
    default:
      return <AlertCircle size={size} color={color} />;
  }
};

export default function RemindersScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>(MOCK_REMINDERS);
  const [showCompleted, setShowCompleted] = useState(false);
  const router = useRouter();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleAddReminder = () => {
    router.push('/reminder/add');
  };

  const handleReminderPress = (reminderId: string) => {
    //@ts-ignore
    router.push(`/reminder/${reminderId}`);
  };

  const toggleReminderComplete = (reminderId: string) => {
    setReminders((prevReminders) =>
      prevReminders.map((reminder) =>
        reminder.id === reminderId
          ? { ...reminder, isComplete: !reminder.isComplete }
          : reminder
      )
    );
  };

  const filteredReminders = React.useMemo(() => {
    let filtered = [...reminders];

    if (!showCompleted) {
      filtered = filtered.filter((reminder) => !reminder.isComplete);
    }

    return filtered.sort((a, b) => {
      if (a.isComplete && !b.isComplete) return 1;
      if (!a.isComplete && b.isComplete) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [reminders, showCompleted]);

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (daysUntil: number, isComplete: boolean) => {
    if (isComplete) return '#10B981'; // Green
    if (daysUntil < 0) return '#EF4444'; // Red - overdue
    if (daysUntil < 7) return '#F59E0B'; // Yellow - due soon
    return '#6B7280'; // Gray - due later
  };

  const getStatusText = (daysUntil: number, isComplete: boolean) => {
    if (isComplete) return 'Completed';
    if (daysUntil < 0) return 'Overdue';
    if (daysUntil === 0) return 'Due today';
    if (daysUntil === 1) return 'Due tomorrow';
    return `Due in ${daysUntil} days`;
  };

  const renderReminderItem = ({ item }: { item: Reminder }) => {
    const vehicle = MOCK_VEHICLES.find((v) => v.id === item.vehicleId);
    const daysUntil = getDaysUntilDue(item.dueDate);
    const statusColor = getStatusColor(daysUntil, item.isComplete);
    const statusText = getStatusText(daysUntil, item.isComplete);

    return (
      <TouchableOpacity
        style={[styles.reminderCard, item.isComplete && styles.completedCard]}
        onPress={() => handleReminderPress(item.id)}
      >
        <View style={styles.reminderHeader}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: item.isComplete ? '#D1FAE5' : '#EEF2FF' },
            ]}
          >
            {getIconForType(
              item.type,
              20,
              item.isComplete ? '#10B981' : '#3B6FE0'
            )}
          </View>
          <View style={styles.reminderInfo}>
            <Text
              style={[
                styles.reminderTitle,
                item.isComplete && styles.completedText,
              ]}
            >
              {item.title}
            </Text>
            <Text style={styles.vehicleName}>
              {vehicle
                ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
                : 'Unknown Vehicle'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => toggleReminderComplete(item.id)}
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor + '20' }, // Add transparency
            ]}
          >
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusText}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reminderDetails}>
          <View style={styles.detailItem}>
            <Calendar size={16} color="#6B7280" />
            <Text style={styles.detailText}>
              {new Date(item.dueDate).toLocaleDateString()}
            </Text>
          </View>
          {item.dueMileage && (
            <View style={styles.detailItem}>
              <Text style={styles.detailText}>
                {item.dueMileage.toLocaleString()} miles
              </Text>
            </View>
          )}
        </View>

        {item.description && (
          <Text style={styles.description}>{item.description}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleSection}>
          <Text style={styles.headerTitle}>Service Reminders</Text>
          <View style={styles.completedToggle}>
            <Text style={styles.toggleLabel}>Show completed</Text>
            <Switch
              value={showCompleted}
              onValueChange={setShowCompleted}
              trackColor={{ false: '#D1D5DB', true: '#BFDBFE' }}
              thumbColor={showCompleted ? '#3B6FE0' : '#F3F4F6'}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddReminder}>
          <PlusCircle size={24} color="#3B6FE0" />
        </TouchableOpacity>
      </View>

      {filteredReminders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <BellOff size={48} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No Reminders</Text>
          <Text style={styles.emptyText}>
            {!showCompleted
              ? "You don't have any upcoming reminders"
              : "You don't have any reminders"}
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={handleAddReminder}
          >
            <Text style={styles.emptyButtonText}>Add Reminder</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredReminders}
          renderItem={renderReminderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitleSection: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 4,
  },
  completedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  addButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  separator: {
    height: 12,
  },
  reminderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  completedCard: {
    opacity: 0.8,
    backgroundColor: '#F9FAFB',
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
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
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 2,
  },
  completedText: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  vehicleName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  reminderDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 6,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#3B6FE0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
