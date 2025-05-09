import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VehicleForm } from "./VehicleForm";
import { Vehicle } from "@prisma/client";
import { useState } from "react";

interface EditVehicleDialogProps {
  vehicle: Vehicle;
}

export function EditVehicleDialog({ vehicle }: EditVehicleDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl overflow-auto p-4 h-[80vh]">
        <DialogHeader>
          <DialogTitle>Edit Vehicle</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <VehicleForm vehicle={vehicle} setOpen={setOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
