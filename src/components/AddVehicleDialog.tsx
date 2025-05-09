"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VehicleForm } from "./VehicleForm";
import { useState } from "react";

export function AddVehicleDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Vehicle</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl overflow-auto p-4 h-[80vh]">
        <DialogHeader>
          <DialogTitle>Add Vehicle</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <VehicleForm setOpen={setOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
