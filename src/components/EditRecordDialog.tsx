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
import { MaintenanceRecord, Vehicle } from "@prisma/client";
import { useEffect, useState } from "react";

interface EditRecordDialogProps {
  maintenanceRecord?: MaintenanceRecord;
}

export function EditRecordDialog({ maintenanceRecord }: EditRecordDialogProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("/api/vehicle", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data);
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit Record</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl overflow-auto p-4 ">
        <DialogHeader>
          <DialogTitle>Edit Maintenance Record</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <MaintenanceRecordForm
            setOpen={setOpen}
            vehicles={vehicles}
            maintenanceRecord={maintenanceRecord}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
