import { generateRandomString } from "@/lib/utils";
import MaintenanceRecordRepository from "@/repositories/MaintenanceRecordRepository";
import MaintenanceTypeRepository from "@/repositories/MaintenanceTypeRepository";
import VehicleRepository from "@/repositories/VehicleRepository";
import { MaintenanceRecord, MaintenanceType, Vehicle } from "@prisma/client";

const SEED_USER_ID = "bab5539b-7e2d-45f6-9178-a53f9cde8f7f";

const vehicleRepository = new VehicleRepository();
const maintenanceRecordRepository = new MaintenanceRecordRepository();
const maintenanceTypeRepository = new MaintenanceTypeRepository();

console.log("Clearing old seed data");
await maintenanceRecordRepository.deleteAll();
await vehicleRepository.deleteAll();
console.log("Data cleared: ready for seed data");

const vehicle1: Omit<Vehicle, "id" | "createdAt" | "updatedAt"> = {
  userId: SEED_USER_ID,
  make: "Ford",
  model: "F150",
  year: 2003,
  active: true,
  color: "Blue",
  vin: generateRandomString(17),
  mileage: 100878,
  purchaseDate: new Date(2005, 3, 15),
};

const vehicle2: Omit<Vehicle, "id" | "createdAt" | "updatedAt"> = {
  userId: SEED_USER_ID,
  make: "Chevrolet",
  model: "S10",
  year: 1994,
  active: true,
  color: "Blue",
  vin: generateRandomString(17),
  mileage: 100878,
  purchaseDate: new Date(1999, 7, 30),
};

console.log("creating vehicles");
const veh1 = await vehicleRepository.create(vehicle1);
const veh2 = await vehicleRepository.create(vehicle2);
console.log("finished creating vehicles");

const maintenanceTypeRecords = await maintenanceTypeRepository.getAll();

if (maintenanceTypeRecords.length < 1) {
  console.log("Creating maintenance types");
  const mType1: Omit<MaintenanceType, "id" | "createdAt" | "updatedAt"> = {
    name: "Oil Change",
  };
  const mType2: Omit<MaintenanceType, "id" | "createdAt" | "updatedAt"> = {
    name: "Brakes",
  };
  const mType3: Omit<MaintenanceType, "id" | "createdAt" | "updatedAt"> = {
    name: "Tires",
  };
  const mType4: Omit<MaintenanceType, "id" | "createdAt" | "updatedAt"> = {
    name: "Repair",
  };
  await maintenanceTypeRepository.create(mType1);
  await maintenanceTypeRepository.create(mType2);
  await maintenanceTypeRepository.create(mType3);
  await maintenanceTypeRepository.create(mType4);
} else {
  console.log("Maintenance types exist: skipping...");
}

const mRecord1: Omit<MaintenanceRecord, "id" | "createdAt" | "updatedAt"> = {
  vehicleId: veh1.id,
  maintenanceTypeId: (await maintenanceTypeRepository.getIdByName("Oil Change"))
    .id,
  date: new Date(2025, 3, 6),
  mileage: 98455,
  description: "Standard oil change with 5w-30",
  location: "Walmart",
  amount: 33.67,
};

const mRecord2: Omit<MaintenanceRecord, "id" | "createdAt" | "updatedAt"> = {
  vehicleId: veh1.id,
  maintenanceTypeId: (await maintenanceTypeRepository.getIdByName("Brakes")).id,
  date: new Date(2025, 1, 6),
  mileage: 92544,
  description: "Front brakes only",
  location: "Jim Bob's Auto Repair",
  amount: 63.45,
};

const mRecord3: Omit<MaintenanceRecord, "id" | "createdAt" | "updatedAt"> = {
  vehicleId: veh2.id,
  maintenanceTypeId: (await maintenanceTypeRepository.getIdByName("Repair")).id,
  date: new Date(2025, 2, 8),
  mileage: 105222,
  description: "New Battery",
  location: "Jim Bob's Auto Repair",
  amount: 163.45,
};

const mRecord4: Omit<MaintenanceRecord, "id" | "createdAt" | "updatedAt"> = {
  vehicleId: veh2.id,
  maintenanceTypeId: (await maintenanceTypeRepository.getIdByName("Tires")).id,
  date: new Date(2025, 4, 8),
  mileage: 109885,
  description: "Replaced all tires",
  location: "Costco",
  amount: 588.45,
};

console.log("creating maintenance records");
await maintenanceRecordRepository.create(mRecord1);
await maintenanceRecordRepository.create(mRecord2);
await maintenanceRecordRepository.create(mRecord3);
await maintenanceRecordRepository.create(mRecord4);
console.log("finished creating maintenance records");
