import { auth } from "@/lib/auth";
import MaintenanceTypeRepository from "@/repositories/MaintenanceTypeRepository";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { id } = await request.json();

  const maintenanceTypeRepository = new MaintenanceTypeRepository();

  try {
    const mType = await maintenanceTypeRepository.getById(id);
    return new Response(JSON.stringify(mType), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Error getting maintenance type", { status: 500 });
  }
}
