"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MaintenanceRecordForm } from "./MaintenanceRecordForm";
import { MaintenanceRecord, MaintenanceType, Vehicle } from "@prisma/client";
import { useState } from "react";

interface AddRecordDialogProps {
  vehicle?: Vehicle;
  vehicles?: Vehicle[];
  maintenanceTypes?: MaintenanceType[];
  maintenanceRecord?: MaintenanceRecord;
}

export function AddRecordDialog({ vehicle, vehicles }: AddRecordDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Record</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl overflow-auto p-4">
        <DialogHeader>
          <DialogTitle>Add Maintenance Record</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <MaintenanceRecordForm
            setOpen={setOpen}
            vehicle={vehicle}
            vehicles={vehicles}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
