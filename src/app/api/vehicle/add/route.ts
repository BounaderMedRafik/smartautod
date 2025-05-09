import { auth } from "@/lib/auth";
import VehicleRepository from "@/repositories/VehicleRepository";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const data = await request.json();
  const vehicleRepository = new VehicleRepository();

  try {
    await vehicleRepository.create({
      userId: session?.user?.id as string,
      ...data,
    });
    revalidatePath("/dashboard/garage");
    return new Response("Vehicle added successfully", { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response("Error added vehicle", { status: 500 });
  }
}
