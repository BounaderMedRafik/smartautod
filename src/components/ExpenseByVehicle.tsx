import React, { ComponentProps } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { cn } from "@/lib/utils";
import { VehicleExpenseData } from "@/models/VehicleExpenseData";
import { Separator } from "./ui/separator";
import NoDataMessage from "./NoDataMessage";

interface ExpenseByVehicleProps extends ComponentProps<"div"> {
  vehicleData: VehicleExpenseData[];
}

const ExpenseByVehicle = ({
  vehicleData,
  className,
}: ExpenseByVehicleProps) => {
  return (
    <Card className={cn(className, "")}>
      <CardHeader className="text-center text-2xl font-semibold">
        YTD Expense By Vehicle
      </CardHeader>
      <CardContent
        className={`flex flex-col justify-start items-center h-full ${className}`}
      >
        {vehicleData?.length > 0 ? (
          vehicleData.map((data) => (
            <div key={data.vehicleId} className="w-full">
              <div className="flex justify-between items-center w-full py-2">
                <p>{data.vehicleName}</p>
                <p>${data.vehicleTotal}</p>
              </div>
              <Separator className="bg-foreground" orientation="horizontal" />
            </div>
          ))
        ) : (
          <NoDataMessage />
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseByVehicle;
