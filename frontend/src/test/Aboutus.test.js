import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AboutUs from "../pages/home/AboutUs";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";

jest.mock("axios");

beforeAll(() => {
  global.alert = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("AboutUs Component", () => {
  // Test 1: Renders the component correctly
  test("renders AboutUs component", () => {
    render(
      <Router>
        <AboutUs />
      </Router>
    );

    expect(screen.getByText("CONTACT US")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your Full Name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Your Email Address")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your Message")).toBeInTheDocument();
  });

  // Test 2: Check roleGreeting logic for different users
  test("displays correct greeting for different roles", async () => {
    // Mock localStorage data and axios call
    localStorage.setItem(
      "user",
      JSON.stringify({ id: 1, UserName: "John", Role: 1 })
    );

    axios.get.mockResolvedValue({ data: { UserName: "John", Role: 1 } });

    render(
      <Router>
        <AboutUs />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/Hello Admin John/)).toBeInTheDocument();
    });
  });
  // Test 3: Prevents form submission with invalid inputs
  test("prevents form submission with invalid inputs", async () => {
    render(
      <Router>
        <AboutUs />
      </Router>
    );

    const submitButton = screen.getByText(/SEND/i);

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Please check the input fields!"
      );
    });

    expect(window.alert).toHaveBeenCalledTimes(1);
  });
});
