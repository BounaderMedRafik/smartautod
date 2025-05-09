"use client";

import React, { ComponentProps, useState } from "react";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { MaintenanceRecordWithType } from "@/models/MaintenanceRecordWithType";
import { MaintenanceType, Vehicle } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddRecordDialog } from "./AddRecordDialog";
import { Input } from "./ui/input";

interface RecordDataTableProps<TData, TValue> extends ComponentProps<"table"> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  vehicles: Vehicle[];
  maintenanceTypes: MaintenanceType[];
}

const RecordDataTable = ({
  data,
  columns,
  vehicles,
  maintenanceTypes,
}: RecordDataTableProps<MaintenanceRecordWithType, unknown>) => {
  const [outsideFilter, setOutsideFilter] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    vehicles.length > 0 ? "all" : null
  );

  const filteredData =
    selectedVehicleId !== "all" && selectedVehicleId
      ? data.filter((record) => record.vehicleId === selectedVehicleId)
      : data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-center sm:text-left">
          Maintenance Reports
        </h1>
        <div className="flex items-center space-x-4">
          <AddRecordDialog
            vehicles={vehicles}
            maintenanceTypes={maintenanceTypes}
          />
        </div>
      </div>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between">
          <Input
            className="max-w-md mb-2"
            value={outsideFilter}
            onChange={(e) => setOutsideFilter(e.target.value)}
            placeholder="Search"
          />
          <Select
            onValueChange={setSelectedVehicleId}
            value={selectedVehicleId || undefined}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select a vehicle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicles</SelectItem>
              {vehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model} ({vehicle.year})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DataTable
          className="w-full"
          columns={columns}
          data={filteredData}
          outsideFilter={outsideFilter}
        />
      </div>
    </div>
  );
};

export default RecordDataTable;
