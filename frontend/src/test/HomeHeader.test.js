import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import HomeHeader from "../../src/modules/components/HomeHeader";

// Mock axios
jest.mock("axios");

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("HomeHeader Component", () => {
  const mockUser = {
    id: 1,
    UserName: "TestUser",
    Role: 3,
  };

  beforeEach(() => {
    localStorage.setItem("user", JSON.stringify(mockUser));
    axios.get.mockResolvedValue({ data: mockUser });
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders HomeHeader with correct elements", async () => {
    render(
      <MemoryRouter>
        <HomeHeader />
      </MemoryRouter>
    );

    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByText("TestUser")).toBeInTheDocument();
    });

    // Check for main header elements
    expect(screen.getByAltText("logo")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(screen.getByText("Dashboard 🔽")).toBeInTheDocument();
  });

  test("handles navigation buttons correctly", () => {
    render(
      <MemoryRouter>
        <HomeHeader />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Home"));
    expect(mockNavigate).toHaveBeenCalledWith("/home");

    fireEvent.click(screen.getByText("About Us"));
    expect(mockNavigate).toHaveBeenCalledWith("/about-us");
  });

  test("shows and hides dropdown menus", async () => {
    render(
      <MemoryRouter>
        <HomeHeader />
      </MemoryRouter>
    );

    const dashboardButton = screen.getByText("Dashboard 🔽");
    fireEvent.click(dashboardButton);

    await waitFor(() => {
      expect(screen.getByText("Car Status")).toBeInTheDocument();
    });

    fireEvent.click(dashboardButton);
    await waitFor(() => {
      expect(screen.queryByText("Car Status")).not.toBeInTheDocument();
    });
  });

  test("logs out user correctly", async () => {
    render(
      <MemoryRouter>
        <HomeHeader />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("TestUser")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/TestUser/i));

    fireEvent.click(screen.getByText("Logout"));

    expect(localStorage.getItem("user")).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("handles API errors gracefully", async () => {
    axios.get.mockRejectedValue(new Error("Network Error"));

    render(
      <MemoryRouter>
        <HomeHeader />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText("TestUser")).not.toBeInTheDocument();
    });
  });
});
