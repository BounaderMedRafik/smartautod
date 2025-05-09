import Link from "next/link";
import React from "react";

const NoDataMessage = () => {
  return (
    <p className="text-center">
      No Data. Add a vehicle to your{" "}
      <Link href="/dashboard/garage" className="underline text-blue-500">
        garage
      </Link>{" "}
      to get started!
    </p>
  );
};

export default NoDataMessage;
