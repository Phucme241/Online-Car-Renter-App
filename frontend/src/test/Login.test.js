import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "../pages/login/Login";
import "@testing-library/jest-dom";
import axios from "axios";

jest.mock("axios");

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("shows error if username and password are empty", () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.click(screen.getByText("Confirm"));

    expect(
      screen.getByText("Username and Password cannot be left blank!")
    ).toBeInTheDocument();
  });

  test("shows error if username is empty", () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText("Password:"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText("Confirm"));

    expect(screen.getByText("Username cannot be blank!")).toBeInTheDocument();
  });

  test("shows error if password is empty", () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText("Username:"), {
      target: { value: "user1" },
    });
    fireEvent.click(screen.getByText("Confirm"));

    expect(screen.getByText("Password cannot be blank!")).toBeInTheDocument();
  });

  test("shows error if password is less than 6 characters", () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText("Username:"), {
      target: { value: "user1" },
    });
    fireEvent.change(screen.getByLabelText("Password:"), {
      target: { value: "12345" },
    });
    fireEvent.click(screen.getByText("Confirm"));

    expect(
      screen.getByText("Password must have at least 6 characters!")
    ).toBeInTheDocument();
  });

  test("calls navigate on successful login", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          UserName: "user1",
          PassWord: "password123",
          id: 1,
          Role: "user",
          Status: true,
        },
      ],
    });

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText("Username:"), {
      target: { value: "user1" },
    });
    fireEvent.change(screen.getByLabelText("Password:"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Confirm"));
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/home", {
        state: { status: true },
      })
    );
  });

  test("alerts invalid login if username or password is wrong", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          UserName: "user1",
          PassWord: "password123",
          id: 1,
          Role: "user",
          Status: true,
        },
      ],
    });

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText("Username:"), {
      target: { value: "user1" },
    });
    fireEvent.change(screen.getByLabelText("Password:"), {
      target: { value: "wrongpassword" },
    });

    global.alert = jest.fn();

    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() =>
      expect(global.alert).toHaveBeenCalledWith("Invalid username or password")
    );
  });

  test("alerts if the account is banned", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          UserName: "user1",
          PassWord: "password123",
          id: 1,
          Role: "user",
          Status: false, // Banned account
        },
      ],
    });

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText("Username:"), {
      target: { value: "user1" },
    });
    fireEvent.change(screen.getByLabelText("Password:"), {
      target: { value: "password123" },
    });

    global.alert = jest.fn();

    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() =>
      expect(global.alert).toHaveBeenCalledWith("Your account was banned!")
    );
  });

  test("handles error during login fetch", async () => {
    axios.get.mockRejectedValueOnce(new Error("Error fetching account data"));

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText("Username:"), {
      target: { value: "user1" },
    });
    fireEvent.change(screen.getByLabelText("Password:"), {
      target: { value: "password123" },
    });

    global.alert = jest.fn();

    // Click the confirm button to trigger login
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() =>
      expect(global.alert).toHaveBeenCalledWith(
        "Error during login. Please try again."
      )
    );
  });
});
