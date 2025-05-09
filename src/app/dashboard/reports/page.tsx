import { auth } from "@/lib/auth";
import VehicleRepository from "@/repositories/VehicleRepository";
import { redirect } from "next/navigation";
import React from "react";
import MaintenanceRecordRepository from "@/repositories/MaintenanceRecordRepository";
import { columns } from "./columns";
import RecordDataTable from "@/components/RecordDataTable";
import { MaintenanceRecordWithType } from "@/models/MaintenanceRecordWithType";
import MaintenanceTypeRepository from "@/repositories/MaintenanceTypeRepository";

const ReportsPage = async () => {
  const vehicleRepository = new VehicleRepository();
  const maintenanceRecordRepository = new MaintenanceRecordRepository();
  const maintenanceTypeRepository = new MaintenanceTypeRepository();
  const session = await auth();

  if (!session?.user) redirect("/");

  const vehicles = await vehicleRepository.getAllByUserId(
    session?.user?.id as string
  );

  const maintRecords: MaintenanceRecordWithType[] =
    await maintenanceRecordRepository.getAllWithMaintenanceType(vehicles);

  const maintTypes = await maintenanceTypeRepository.getAll();

  return (
    <RecordDataTable
      data={maintRecords}
      columns={columns}
      vehicles={vehicles}
      maintenanceTypes={maintTypes}
    />
  );
};

export default ReportsPage;
