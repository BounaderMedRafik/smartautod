import MaintenanceTypeRepository from "@/repositories/MaintenanceTypeRepository";
import MaintenanceRecordRepository from "@/repositories/MaintenanceRecordRepository";
import { Vehicle } from "@prisma/client";
import { MaintenanceTypeName } from "@/types/MaintenanceTypeName";

export async function getChartData(vehicles: Vehicle[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartData: any[] = [];
  const maintenanceTypeRepository = new MaintenanceTypeRepository();
  const maintenanceRecordRepository = new MaintenanceRecordRepository();
  const maintTypes = await maintenanceTypeRepository.getAll();

  await Promise.all(
    maintTypes.map(async (mType, idx) => {
      const total = await maintenanceRecordRepository.getYtdTotalByMaintType(
        vehicles,
        mType.name as MaintenanceTypeName
      );
      const data = {
        maintType: mType.name,
        amount: total,
        fill: `var(--chart-${idx + 1})`,
      };
      chartData.push(data);
    })
  );

  return chartData;
}
