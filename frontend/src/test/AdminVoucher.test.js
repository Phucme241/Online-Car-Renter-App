import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import AdminVouchers from "../pages/admin/AdminVouchers";

// Mock axios
jest.mock("axios");

describe("AdminVouchers Component", () => {
  const mockVouchers = [
    {
      VoucherID: 1,
      VoucherCode: "SAVE10",
      DiscountAmount: 10,
      image: "/voucher1.jpg",
    },
    {
      VoucherID: 2,
      VoucherCode: "SAVE20",
      DiscountAmount: 20,
      image: "/voucher2.jpg",
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockVouchers });
    axios.post.mockResolvedValue({});
    axios.delete.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("deletes a voucher", async () => {
    render(
      <MemoryRouter>
        <AdminVouchers />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("SAVE10 - 10%")).toBeInTheDocument();
    });

    // Simulate delete
    const deleteButton = screen.getAllByRole("button", { name: /delete/i })[0];
    fireEvent.click(deleteButton);

    // Ensure API call is made
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        "http://localhost:5000/api/voucher/1"
      );
    });

    // Verify the voucher is removed from the DOM
    await waitFor(() => {
      expect(screen.queryByText("SAVE10 - 10%")).not.toBeInTheDocument();
    });
  });
});
