import { auth } from "@/lib/auth";
import VehicleRepository from "@/repositories/VehicleRepository";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const vehicleRepository = new VehicleRepository();
  const vehicles = await vehicleRepository.getAllByUserId(
    session?.user?.id as string
  );
  return new Response(JSON.stringify(vehicles), { status: 200 });
}
