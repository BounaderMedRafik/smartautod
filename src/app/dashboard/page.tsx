import AnnualTotalCard from "@/components/AnnualTotalCard";
import { ExpenseByCategoryChart } from "@/components/ExpenseByCategoryChart";
import ExpenseByVehicle from "@/components/ExpenseByVehicle";
import { auth } from "@/lib/auth";
import { VehicleExpenseData } from "@/models/VehicleExpenseData";
import MaintenanceRecordRepository from "@/repositories/MaintenanceRecordRepository";
import React from "react";
import { redirect } from "next/navigation";
import { getVehicleExpenseData } from "@/services/VehicleService";
import VehicleRepository from "@/repositories/VehicleRepository";
import { getChartData } from "@/services/ChartDataService";
import { AddRecordDialog } from "@/components/AddRecordDialog";
import MaintenanceTypeRepository from "@/repositories/MaintenanceTypeRepository";

const DashboardHome = async () => {
  const maintenanceRecordRepository = new MaintenanceRecordRepository();
  const maintenanceTypeRepository = new MaintenanceTypeRepository();
  const vehicleRepository = new VehicleRepository();
  const session = await auth();

  if (!session?.user) redirect("/");

  const vehicles = await vehicleRepository.getAllByUserId(
    session?.user?.id as string
  );

  const vehicleData: VehicleExpenseData[] = await getVehicleExpenseData(
    vehicles
  );

  const ytdTotal = await maintenanceRecordRepository.getYTDTotalByUser(
    session?.user?.id as string
  );
  const chartData = await getChartData(vehicles);

  const maintTypes = await maintenanceTypeRepository.getAll();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-center sm:text-left">Home</h1>
        <AddRecordDialog vehicles={vehicles} maintenanceTypes={maintTypes} />
      </div>
      <div className="grid gap-6 px-4 sm:px-6 lg:px-8 grid-cols-1 sm:grid-cols-2 auto-rows-fr">
        <AnnualTotalCard className="col-span-1" ytdTotal={ytdTotal} />
        <ExpenseByCategoryChart
          className="col-span-1 sm:col-span-1 md:row-start-2"
          chartData={chartData}
          hasRecords={ytdTotal > 0}
        />
        <ExpenseByVehicle
          className="col-span-1 sm:col-span-1 md:col-start-2 md:row-span-2"
          vehicleData={vehicleData}
        />
      </div>
    </div>
  );
};

export default DashboardHome;
