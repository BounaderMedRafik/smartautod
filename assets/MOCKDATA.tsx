import { FinancialRecord, MaintenanceRecord, Reminder, Vehicle } from '@/types';
import { FileText, Fuel, Shield, Tag } from 'lucide-react-native';

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: '1',
    userId: '1',
    make: 'Renault',
    model: 'Symbol',
    year: 2019,
    color: 'White',
    licensePlate: '123-4567',
    mileage: 32000,
    purchaseDate: '2019-04-10',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Renault_Symbol_1.6_Expression_2015.jpg/960px-Renault_Symbol_1.6_Expression_2015.jpg',
  },
  {
    id: '2',
    userId: '1',
    make: 'Renault',
    model: 'Clio 4',
    year: 2017,
    color: 'Gray',
    licensePlate: '789-0123',
    mileage: 58000,
    purchaseDate: '2017-08-22',
    imageUrl:
      'https://cdn.motor1.com/images/mgl/0Bj03/s1/renault-clio-4-face-a-clio-5.jpg',
  },
];

export const MOCK_MAINTENANCE: MaintenanceRecord[] = [
  {
    id: '1',
    vehicleId: '1',
    title: 'Oil Change',
    description: 'Regular oil change and filter replacement',
    date: '2023-10-15',
    mileage: 12500,
    cost: 65.99,
    location: 'QuickLube Service',
    isScheduled: false,
    isDone: true,
  },
  {
    id: '2',
    vehicleId: '1',
    title: 'Brake Pad Replacement',
    description: 'Front brake pads replacement',
    date: '2023-08-20',
    mileage: 10200,
    cost: 189.99,
    location: 'City Auto Repair',
    isScheduled: false,
    isDone: true,
  },
  {
    id: '3',
    vehicleId: '2',
    title: 'Tire Rotation',
    description: 'Regular tire rotation service',
    date: '2023-09-05',
    mileage: 41000,
    cost: 30.0,
    location: 'Discount Tire',
    isScheduled: false,
    isDone: true,
  },
  {
    id: '4',
    vehicleId: '1',
    title: 'Scheduled Maintenance',
    description: '25,000 mile service check',
    date: '2023-12-30',
    mileage: 25000,
    cost: 250.0,
    isScheduled: true,
    isDone: false,
  },
];

export const MOCK_REMINDERS: Reminder[] = [
  {
    id: '1',
    vehicleId: '1',
    title: 'Oil Change',
    description: 'Regular 5,000 mile oil change service',
    dueDate: '2023-11-30',
    dueMileage: 17500,
    type: 'maintenance',
    isComplete: false,
    recurringInterval: 90, // 90 days
    recurringMileage: 5000,
  },
  {
    id: '2',
    vehicleId: '1',
    title: 'Tire Rotation',
    description: 'Rotate tires for even wear',
    dueDate: '2023-12-15',
    dueMileage: 20000,
    type: 'maintenance',
    isComplete: false,
    recurringInterval: 180, // 180 days
    recurringMileage: 7500,
  },
  {
    id: '3',
    vehicleId: '2',
    title: 'Insurance Renewal',
    description: 'Renew auto insurance policy',
    dueDate: '2023-12-01',
    type: 'insurance',
    isComplete: false,
    recurringInterval: 365, // 365 days
  },
  {
    id: '4',
    vehicleId: '1',
    title: 'Registration Renewal',
    description: 'Renew vehicle registration at DMV',
    dueDate: '2024-02-15',
    type: 'tax',
    isComplete: false,
    recurringInterval: 365, // 365 days
  },
];

export const EXPENSE_TYPES = [
  { id: 'fuel', label: 'Fuel', icon: Fuel },
  { id: 'insurance', label: 'Insurance', icon: Shield },
  { id: 'tax', label: 'Tax', icon: FileText },
  { id: 'other', label: 'Other', icon: Tag },
];

export const MOCK_FINANCE: FinancialRecord[] = [
  {
    id: '1',
    vehicleId: '1',
    type: 'fuel',
    amount: 45.67,
    date: '2023-10-20',
    description: 'Fuel refill - 12 gallons',
  },
  {
    id: '2',
    vehicleId: '2',
    type: 'insurance',
    amount: 120.0,
    date: '2023-10-01',
    description: 'Monthly insurance payment',
  },
];
