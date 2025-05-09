import { auth } from "@/lib/auth";
import VehicleRepository from "@/repositories/VehicleRepository";
import { redirect } from "next/navigation";
import { columns } from "./columns";
import { AddVehicleDialog } from "@/components/AddVehicleDialog";
import GarageDataTable from "@/components/GarageDataTable";

const GaragePage = async () => {
  const vehicleRepository = new VehicleRepository();
  const session = await auth();

  if (!session?.user) redirect("/");

  const vehicles = await vehicleRepository.getAllByUserId(
    session?.user?.id as string
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-center sm:text-left px-4 sm:px-6 lg:px-8">
          Garage
        </h1>
        <AddVehicleDialog />
      </div>
      <div className="px-4 sm:px-6 lg:px-8">
        <GarageDataTable columns={columns} data={vehicles} />
      </div>
    </div>
  );
};

export default GaragePage;
