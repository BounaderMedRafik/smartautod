import { MaintenanceTypeName } from "@/types/MaintenanceTypeName";

export interface CostByCategoryChartData {
  maintType: MaintenanceTypeName;
  amount: number;
  fill: string;
}
