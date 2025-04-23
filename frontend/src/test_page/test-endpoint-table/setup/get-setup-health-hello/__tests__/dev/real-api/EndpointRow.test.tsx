import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  describe,
  it,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
  vi,
  expect,
} from "vitest";
import EndpointRow from "../../../EndpointRow";
import { apiClient } from "../../../../../../../../api";
import axios from "axios";

// Test both success and error scenarios from the API
describe("Get Setup Health Hello EndpointRow with API (Test Environment)", () => {
  // Save original implementation to restore after tests
  let originalApiGet: typeof apiClient.get;

  beforeAll(() => {
    // Save original implementation
    originalApiGet = apiClient.get;
  });

  afterAll(() => {
    // Restore original implementation after all tests
    apiClient.get = originalApiGet;
  });

  beforeEach(() => {
    // Clear any previous mock data
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up after each test
    vi.clearAllMocks();
  });

  // Test rendering
  it("renders the component correctly", () => {
    render(<EndpointRow />);

    expect(screen.getByText("GET")).toBeInTheDocument();
    expect(screen.getByText("/api/setup/health/hello")).toBeInTheDocument();
    expect(screen.getByText(/"message":/)).toBeInTheDocument();
    expect(
      screen.getByText(/"Hello World from Dottie API!"/)
    ).toBeInTheDocument();
  });

  // Test successful API response
  it("handles successful API response correctly", async () => {
    // Mock successful API response
    apiClient.get = vi.fn().mockImplementation((url) => {
      if (url === "/api/setup/health/hello") {
        return Promise.resolve({
          status: 200,
          data: { message: "Hello World from Dottie API!" },
        });
      }
      return Promise.reject(new Error("Endpoint not found"));
    });

    render(<EndpointRow />);

    // Find and click the endpoint button
    const button = screen.getByRole("button", {
      name: /GET \/api\/setup\/health\/hello/i,
    });
    fireEvent.click(button);

    // Verify the API was called with the correct endpoint
    expect(apiClient.get).toHaveBeenCalledWith("/api/setup/health/hello");

    // Wait for the success response to appear
    await waitFor(
      () => {
        // Check for success status
        const successElement = screen.getByText(/success/i);
        expect(successElement).toBeInTheDocument();

        // Check for message in response
        const responseTexts = screen.getAllByText(
          /"message": "Hello World from Dottie API!"/i,
          { exact: false }
        );
        expect(responseTexts.length).toBeGreaterThanOrEqual(1);
      },
      { timeout: 5000 }
    );
  });

  // Test error API response
  it("handles error API response correctly", async () => {
    // Mock error API response
    apiClient.get = vi.fn().mockImplementation((url) => {
      if (url === "/api/setup/health/hello") {
        return Promise.reject({
          response: {
            status: 500,
            data: { error: "Internal Server Error" },
          },
        });
      }
      return Promise.reject(new Error("Endpoint not found"));
    });

    render(<EndpointRow />);

    // Find and click the endpoint button
    const button = screen.getByRole("button", {
      name: /GET \/api\/setup\/health\/hello/i,
    });
    fireEvent.click(button);

    // Verify the API was called with the correct endpoint
    expect(apiClient.get).toHaveBeenCalledWith("/api/setup/health/hello");

    // Wait for the error response to appear
    await waitFor(
      () => {
        // Check for error status - use getAllByText since "error" appears multiple times
        const errorElements = screen.getAllByText(/error/i);
        expect(errorElements.length).toBeGreaterThanOrEqual(1);

        // Check for the specific error message
        expect(screen.getByText(/Internal Server Error/i)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });
});
