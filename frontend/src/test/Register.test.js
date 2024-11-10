import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import Register from "../pages/login/Register";

jest.mock("axios");

describe("Register Component", () => {
  beforeEach(() => {
    render(
      <Router>
        <Register />
      </Router>
    );
  });

  test("renders register form", () => {
    expect(screen.getByLabelText(/Username:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date Of Birth:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
  });

  test("shows error message for invalid password", () => {
    const passwordInput = screen.getByLabelText(/Password:/i);
    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.blur(passwordInput);

    expect(
      screen.getByText(/Password must have at least 6 characters/i)
    ).toBeInTheDocument();
  });

  test("shows error message for invalid phone number", () => {
    const phoneInput = screen.getByLabelText(/Phone:/i);
    fireEvent.change(phoneInput, { target: { value: "12345" } });
    fireEvent.blur(phoneInput);

    expect(
      screen.getByText(/Phone number must be 10 digits/i)
    ).toBeInTheDocument();
  });

  test("shows error message for invalid email", () => {
    const emailInput = screen.getByLabelText(/Email:/i);
    fireEvent.change(emailInput, { target: { value: "invalidemail" } });
    fireEvent.blur(emailInput);

    expect(screen.getByText(/Invalid email/i)).toBeInTheDocument();
  });

  test("shows error message for invalid date of birth", () => {
    const dobInput = screen.getByLabelText(/Date Of Birth:/i);
    fireEvent.change(dobInput, { target: { value: "2025-12-31" } });
    fireEvent.blur(dobInput);

    expect(screen.getByText(/Invalid date of birth/i)).toBeInTheDocument();
  });
});
