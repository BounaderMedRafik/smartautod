import { auth } from "@/lib/auth";
import MaintenanceRecordRepository from "@/repositories/MaintenanceRecordRepository";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const data = await request.json();
  const maintenanceRecordRepository = new MaintenanceRecordRepository();

  try {
    await maintenanceRecordRepository.update(data.id, data.maintRecord);
    return new Response("Maintenance record updated successfully", {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Error updating maintenance record", { status: 500 });
  }
}
