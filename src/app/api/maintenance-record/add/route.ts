import { auth } from "@/lib/auth";
import MaintenanceRecordRepository from "@/repositories/MaintenanceRecordRepository";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const maintenanceRecordRepository = new MaintenanceRecordRepository();

  try {
    await maintenanceRecordRepository.create(data);
    return new Response("Maintenance record added successfully", {
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return new Response("Error adding maintenance record", { status: 500 });
  }
}
