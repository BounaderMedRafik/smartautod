import AnnualTotalCard from "@/components/AnnualTotalCard";
import { render, screen } from "@testing-library/react";

describe("Annual Total Card", () => {
  it("should render a card title", async () => {
    render(<AnnualTotalCard ytdTotal={788} />);
    const text = await screen.findByText(/YTD Total Expenses/i);
    expect(text).toBeInTheDocument();
  });
});
