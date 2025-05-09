import React, { ComponentProps } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { cn } from "@/lib/utils";

interface AnnualTotalCardProps extends ComponentProps<"div"> {
  ytdTotal: number;
}

const AnnualTotalCard = (props: AnnualTotalCardProps) => {
  return (
    <Card className={cn(props.className, "")}>
      <CardHeader className="text-center text-2xl font-semibold">
        YTD Total Expenses
      </CardHeader>
      <CardContent className="flex justify-center items-center h-full">
        <span className="text-5xl">
          $<span>{props.ytdTotal.toFixed(2)}</span>
        </span>
      </CardContent>
    </Card>
  );
};

export default AnnualTotalCard;
