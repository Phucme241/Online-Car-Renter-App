import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Payment from "../pages/payment/Payment";
import "@testing-library/jest-dom"; // Adjust the import according to your file structure
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

describe("Payment Component", () => {
  let mockNavigate;
  let mockLocation;

  beforeEach(() => {
    mockNavigate = jest.fn();
    mockLocation = {
      state: {
        totalPay: 100000,
      },
    };

    jest
      .spyOn(require("react-router-dom"), "useNavigate")
      .mockReturnValue(mockNavigate);
    jest
      .spyOn(require("react-router-dom"), "useLocation")
      .mockReturnValue(mockLocation);
  });

  test("renders Payment component with totalPay", () => {
    render(
      <Router>
        <Payment />
      </Router>
    );
    expect(screen.getByText(/Pay/)).toBeInTheDocument();
    expect(screen.getByText(/100.000/)).toBeInTheDocument();
  });

  test("navigates to /car-status when Confirm button is clicked", async () => {
    render(
      <Router>
        <Payment />
      </Router>
    );

    // Click the "Confirm" button
    fireEvent.click(screen.getByText("Confirm"));

    // Wait for navigation to happen
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/car-status")
    );
  });

  test("renders the payment partner logos", () => {
    render(
      <Router>
        <Payment />
      </Router>
    );

    // Check if bank logos are rendered
    expect(screen.getByAltText("vietcombank")).toBeInTheDocument();
    expect(screen.getByAltText("techcombank")).toBeInTheDocument();
    expect(screen.getByAltText("bidv")).toBeInTheDocument();
    expect(screen.getByAltText("tpbank")).toBeInTheDocument();
    expect(screen.getByAltText("vietinbank")).toBeInTheDocument();
    expect(screen.getByAltText("vib")).toBeInTheDocument();
    expect(screen.getByAltText("hdbank")).toBeInTheDocument();
    expect(screen.getByAltText("vpbank")).toBeInTheDocument();
    expect(screen.getByAltText("acb")).toBeInTheDocument();
    expect(screen.getByAltText("lienvietpostbank")).toBeInTheDocument();
    expect(screen.getByAltText("mbbank")).toBeInTheDocument();
    expect(screen.getByAltText("sacombank")).toBeInTheDocument();
  });
});
