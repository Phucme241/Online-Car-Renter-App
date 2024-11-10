import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import NotificationForm from "../../src/modules/components/NotificationForm";
import "@testing-library/jest-dom";
import axios from "axios";

// Mock Axios
jest.mock("axios");

describe("NotificationForm", () => {
  test("renders NotificationForm correctly", () => {
    render(
      <Router>
        <NotificationForm id="1" />
      </Router>
    );

    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });

  test("shows and hides notifications popup", async () => {
    render(
      <Router>
        <NotificationForm id="1" />
      </Router>
    );

    fireEvent.click(screen.getByText("Notifications"));

    expect(screen.getByText("Notification")).toBeInTheDocument();

    fireEvent.click(screen.getByText("< Back"));

    expect(screen.queryByText("Notification")).not.toBeInTheDocument();
  });

  test("fetches and displays notifications", async () => {
    // Mock Axios to simulate an API response
    const mockNotifications = [
      {
        Description: "New notification 1",
        NotificationDate: "2024-11-09T10:00:00Z",
      },
      {
        Description: "New notification 2",
        NotificationDate: "2024-11-08T10:00:00Z",
      },
    ];

    axios.get.mockResolvedValue({ data: mockNotifications });

    render(
      <Router>
        <NotificationForm id="1" />
      </Router>
    );

    fireEvent.click(screen.getByText("Notifications"));

    await waitFor(() => {
      expect(screen.getByText("New notification 1")).toBeInTheDocument();
      expect(screen.getByText("New notification 2")).toBeInTheDocument();
    });

    // Check if the notifications are displayed with the correct date format (9/11/2024)
    expect(screen.getByText("9/11/2024")).toBeInTheDocument();
    expect(screen.getByText("8/11/2024")).toBeInTheDocument();
  });
});
