import "@testing-library/jest-dom"; // Add this import
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../pages/home/Home";
import { BrowserRouter as Router } from "react-router-dom";

describe("Home Component", () => {
  test("should render and respond to Rent Now button click", () => {
    render(
      <Router>
        <Home id={1} />
      </Router>
    );

    const rentNowButton = screen.getByText(/Rent Now/i);

    expect(rentNowButton).toBeInTheDocument();

    fireEvent.click(rentNowButton);
  });
  test("should render and respond to Home button click", () => {
    render(
      <Router>
        <Home id={1} />
      </Router>
    );

    const homeButton = screen.getByText(/Home/i);

    expect(homeButton).toBeInTheDocument();

    fireEvent.click(homeButton);
  });
  test("should render and respond to Home button click", () => {
    render(
      <Router>
        <Home id={1} />
      </Router>
    );

    const homeButton = screen.getByText(/Home/i);

    expect(homeButton).toBeInTheDocument();

    fireEvent.click(homeButton);
  });
});
