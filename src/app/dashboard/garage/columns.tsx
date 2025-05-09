"use client";

import { AddRecordDialog } from "@/components/AddRecordDialog";
import DeleteVehicleAlertDialog from "@/components/DeleteVehicleAlertDialog";
import { EditVehicleDialog } from "@/components/EditVehicleDialog";
import { Vehicle } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Vehicle>[] = [
  {
    header: "Vehicle",
    accessorFn: (row) => row.year + " " + row.model + " " + row.make,
    cell: ({ row }) => {
      const vehicle = row.original;
      return (
        <div className="flex justify-start items-center">
          <p>{vehicle.year + " " + vehicle.model + " " + vehicle.make}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const vehicle = row.original;
      return (
        <div className="flex space-x-2 justify-end">
          <AddRecordDialog vehicle={vehicle} />
          <EditVehicleDialog vehicle={vehicle} />
          <DeleteVehicleAlertDialog vehicleId={vehicle.id} />
        </div>
      );
    },
  },
];
