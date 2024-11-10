import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Voucher from "../../src/modules/components/Voucher";

// Mock axios
jest.mock("axios");

describe("Voucher Component", () => {
  const mockVouchers = [
    {
      VoucherID: 1,
      VoucherCode: "SAVE10",
      DiscountAmount: 10,
      IsClaimed: false,
      image: "/save10.jpg",
    },
    {
      VoucherID: 2,
      VoucherCode: "SAVE20",
      DiscountAmount: 20,
      IsClaimed: true,
      image: "/save20.jpg",
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockVouchers });
    axios.put.mockResolvedValue({});
    localStorage.setItem("user", JSON.stringify({ id: 123 }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders unclaimed and claimed vouchers correctly", async () => {
    render(
      <MemoryRouter>
        <Voucher />
      </MemoryRouter>
    );

    // Wait for unclaimed vouchers to render
    await waitFor(() => {
      expect(screen.getByText("SAVE10")).toBeInTheDocument();
      expect(screen.getByText("10% off")).toBeInTheDocument();
    });

    // Check claimed vouchers
    expect(screen.getByText("SAVE20")).toBeInTheDocument();
    expect(screen.getByText("20% off")).toBeInTheDocument();
    expect(screen.getByText("Claimed")).toBeInTheDocument();
  });

  test("calls claimVoucher API on button click", async () => {
    render(
      <MemoryRouter>
        <Voucher />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("SAVE10")).toBeInTheDocument();
    });

    // Click the "Claim" button
    const claimButton = screen.getByRole("button", { name: /Claim/i });
    fireEvent.click(claimButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        "http://localhost:5000/api/voucher/claim/1",
        {
          userId: 123,
        }
      );
    });

    expect(axios.get).toHaveBeenCalledTimes(2);
  });

  test("handles API errors gracefully", async () => {
    axios.get.mockRejectedValue(new Error("Network Error"));

    render(
      <MemoryRouter>
        <Voucher />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText("SAVE10")).not.toBeInTheDocument();
      expect(screen.queryByText("SAVE20")).not.toBeInTheDocument();
    });
  });
});
