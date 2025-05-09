import { VehicleExpenseData } from "@/models/VehicleExpenseData";
import MaintenanceRecordRepository from "@/repositories/MaintenanceRecordRepository";
import { Vehicle } from "@prisma/client";

export async function getVehicleExpenseData(
  vehicles: Vehicle[]
): Promise<VehicleExpenseData[]> {
  const maintenanceRecordRepository = new MaintenanceRecordRepository();

  const expenseData: VehicleExpenseData[] = [];

  vehicles.map(async (vehicle) => {
    const ytdTotal = await maintenanceRecordRepository.getYTDTotalByVehicle(
      vehicle.id
    );
    const vehicleName = vehicle.year + " " + vehicle.make + " " + vehicle.model;
    const data: VehicleExpenseData = {
      vehicleId: vehicle.id,
      vehicleName,
      vehicleTotal: ytdTotal.toFixed(2),
    };
    expenseData.push(data);
  });

  return Promise.resolve(expenseData);
}
