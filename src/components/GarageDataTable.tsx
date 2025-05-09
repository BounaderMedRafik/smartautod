"use client";

import { Vehicle } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import React, { ComponentProps, useState } from "react";
import { DataTable } from "./DataTable";
import { Input } from "./ui/input";

interface RecordDataTableProps<TData, TValue> extends ComponentProps<"table"> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const GarageDataTable = ({
  columns,
  data,
}: RecordDataTableProps<Vehicle, unknown>) => {
  const [outsideFilter, setOutsideFilter] = useState("");
  return (
    <div>
      <Input
        className="max-w-md mb-2"
        value={outsideFilter}
        onChange={(e) => setOutsideFilter(e.target.value)}
        placeholder="Search"
      />
      <DataTable columns={columns} data={data} outsideFilter={outsideFilter} />
    </div>
  );
};

export default GarageDataTable;
