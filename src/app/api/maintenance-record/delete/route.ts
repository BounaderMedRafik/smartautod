import { auth } from "@/lib/auth";
import MaintenanceRecordRepository from "@/repositories/MaintenanceRecordRepository";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const data = await request.json();
  const maintenanceRecordRepository = new MaintenanceRecordRepository();

  try {
    await maintenanceRecordRepository.delete(data.id);
    return new Response("Maintenance record deleted successfully", {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Error deleting maintenance record", { status: 500 });
  }
}
