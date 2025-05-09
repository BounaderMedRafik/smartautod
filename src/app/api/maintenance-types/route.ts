import MaintenanceTypeRepository from "@/repositories/MaintenanceTypeRepository";

export async function GET() {
  const maintenanceTypeRepository = new MaintenanceTypeRepository();
  const maintenanceTypes = await maintenanceTypeRepository.getAll();
  return new Response(JSON.stringify(maintenanceTypes), { status: 200 });
}
