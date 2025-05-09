import React from "react";
import { render, screen } from "@testing-library/react";
import ExpenseByVehicle from "@/components/ExpenseByVehicle";
import { VehicleExpenseData } from "@/models/VehicleExpenseData";

jest.mock("next/link", () => {
  const MockLink = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>;
  MockLink.displayName = "MockLink";
  return MockLink;
});

describe("ExpenseByVehicle", () => {
  it("renders NoDataMessage when vehicleData is an empty array", () => {
    const vehicleData: VehicleExpenseData[] = [];

    render(<ExpenseByVehicle vehicleData={vehicleData} />);

    const noDataMessage = screen.getByText(/No Data\./);
    expect(noDataMessage).toBeInTheDocument();
    expect(noDataMessage).toContainElement(screen.getByText("garage"));

    const vehicleItems = screen.queryByText(/\$/);
    expect(vehicleItems).not.toBeInTheDocument();
  });
});
