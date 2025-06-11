export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Vehicle {
  id: string; //auto generated from supabase
  userId: string; // get it using useStoredData.ts
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  mileage: number;
  purchaseDate: string;
  imageUrl?: string;
  vin?: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  userid: string | undefined;
  title: string;
  description: string;
  date: string;
  mileage: number;
  cost?: number;
  location?: string;
  isScheduled: boolean;
  isDone: boolean;
}

export interface FinancialRecord {
  id: string;
  vehicleId: string;
  type: 'fuel' | 'insurance' | 'tax' | 'maintenance' | 'other';
  amount: number;
  date: string;
  description: string;
}

export interface Reminder {
  id: string;
  vehicleId: string;
  userid: string | undefined;
  title: string;
  description: string;
  dueDate: string;
  dueMileage?: number;
  type: 'fuel' | 'maintenance' | 'insurance' | 'tax' | 'other';
  isComplete: boolean;
  recurringInterval?: number; // in days
  recurringMileage?: number; // after how many miles
}

export type MaintenanceType =
  | 'oil_change'
  | 'tire_rotation'
  | 'air_filter'
  | 'brake_service'
  | 'engine_service'
  | 'transmission_service'
  | 'battery_replacement'
  | 'other';

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isSignout: boolean;
}

export interface VehicleCardProps {
  vehicle: Vehicle;
  userId: string | undefined;
  onPress: () => void;
}

export interface Mechanics {
  name: string;
  description: string;
  phonenum: string;
  location: string;
  image: string;
}
