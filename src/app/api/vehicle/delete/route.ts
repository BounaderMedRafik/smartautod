import { auth } from "@/lib/auth";
import VehicleRepository from "@/repositories/VehicleRepository";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const data = await request.json();
  const vehicleRepository = new VehicleRepository();

  try {
    await vehicleRepository.delete(data.id);
    revalidatePath("/dashboard/garage");
    return new Response("Vehicle deleted successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Error deleting vehicle", { status: 500 });
  }
}
