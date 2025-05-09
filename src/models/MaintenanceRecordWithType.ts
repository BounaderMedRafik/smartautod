import { MaintenanceRecord, MaintenanceType } from "@prisma/client";

export type MaintenanceRecordWithType = MaintenanceRecord & {
  maintenanceType: MaintenanceType;
};
