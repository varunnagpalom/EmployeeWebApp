import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "../components/Dashboard";
import {
  renderWithRouter,
  mockEmployees,
  mockFetchSuccess,
  mockFetchError,
} from "../test/utils.jsx";

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Dashboard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Component Rendering", () => {
    it("renders dashboard with title and create button", async () => {
      mockFetchSuccess(mockEmployees);

      renderWithRouter(<Dashboard />);

      expect(
        screen.getByText("Employee Management Portal")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /create employee/i })
      ).toBeInTheDocument();
    });

    it("shows loading state initially", () => {
      mockFetchSuccess(mockEmployees);

      renderWithRouter(<Dashboard />);

      expect(screen.getByText("Loading employees...")).toBeInTheDocument();
    });
  });

  describe("Employee Data Loading", () => {
    it("loads and displays employee data successfully", async () => {
      mockFetchSuccess(mockEmployees);

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      expect(screen.getByText("Heman")).toBeInTheDocument();
      expect(screen.getByText("Spider Man")).toBeInTheDocument();
      expect(screen.getByText("Joker")).toBeInTheDocument();

      // Check table headers
      expect(screen.getByText("Employee ID")).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Date of Joining")).toBeInTheDocument();
      expect(screen.getByText("Department")).toBeInTheDocument();
      expect(screen.getByText("Salary")).toBeInTheDocument();
      expect(screen.getByText("Manager ID")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByText("Actions")).toBeInTheDocument();
    });

    it("displays formatted salary and date", async () => {
      mockFetchSuccess(mockEmployees);

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("$80,000.00")).toBeInTheDocument();
      });

      // Check that dates are formatted properly
      expect(screen.getAllByText("8/18/2025")).toHaveLength(3);
      expect(screen.getByText("8/1/2025")).toBeInTheDocument();
    });

    it("displays employee status with proper styling", async () => {
      mockFetchSuccess(mockEmployees);

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        const activeStatuses = screen.getAllByText("ACTIVE");
        const notActiveStatus = screen.getByText("NOT_ACTIVE");

        expect(activeStatuses).toHaveLength(3);
        expect(notActiveStatus).toBeInTheDocument();

        // Check CSS classes
        activeStatuses.forEach((status) => {
          expect(status).toHaveClass("status", "active");
        });
        expect(notActiveStatus).toHaveClass("status", "not-active");
      });
    });

    it("displays no data message when employee list is empty", async () => {
      mockFetchSuccess([]);

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("No data available")).toBeInTheDocument();
      });
    });

    it("displays error message when API call fails", async () => {
      mockFetchError("Network error");

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to fetch employees/)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Navigation Actions", () => {
    it("navigates to create employee page when create button is clicked", async () => {
      mockFetchSuccess(mockEmployees);
      const user = userEvent.setup();

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      const createButton = screen.getByRole("button", {
        name: /create employee/i,
      });
      await user.click(createButton);

      expect(mockNavigate).toHaveBeenCalledWith("/create-employee");
    });

    it("navigates to edit employee page with employee data", async () => {
      mockFetchSuccess(mockEmployees);
      const user = userEvent.setup();

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      const editButtons = screen.getAllByRole("button", { name: /edit/i });
      await user.click(editButtons[0]);

      expect(mockNavigate).toHaveBeenCalledWith("/edit-employee", {
        state: { employee: mockEmployees[0] },
      });
    });
  });

  describe("Delete Employee Functionality", () => {
    it("successfully deletes an employee", async () => {
      mockFetchSuccess(mockEmployees);
      const user = userEvent.setup();

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      // Mock successful delete
      fetch.mockResolvedValueOnce({ status: 204 });
      // Mock refresh after delete
      mockFetchSuccess(mockEmployees.slice(1));

      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(
          screen.getByText("Employee Deleted Successfully")
        ).toBeInTheDocument();
      });

      // Check that delete API was called with correct employee ID
      expect(fetch).toHaveBeenCalledWith("/api/employees/1", {
        method: "DELETE",
      });
    });

    it("shows loading state during delete operation", async () => {
      mockFetchSuccess(mockEmployees);
      const user = userEvent.setup();

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      // Mock slow delete response
      fetch.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ status: 204 }), 100);
          })
      );

      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      await user.click(deleteButtons[0]);

      expect(screen.getAllByText("Deleting...")).toHaveLength(4);
    });

    it("displays error message when delete fails", async () => {
      mockFetchSuccess(mockEmployees);
      const user = userEvent.setup();

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      // Mock failed delete
      fetch.mockResolvedValueOnce({ status: 500 });

      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to delete employee/)
        ).toBeInTheDocument();
      });
    });

    it("closes success modal when OK button is clicked", async () => {
      mockFetchSuccess(mockEmployees);
      const user = userEvent.setup();

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      // Mock successful delete
      fetch.mockResolvedValueOnce({ status: 204 });
      mockFetchSuccess(mockEmployees.slice(1));

      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(
          screen.getByText("Employee Deleted Successfully")
        ).toBeInTheDocument();
      });

      const okButton = screen.getByRole("button", { name: /ok/i });
      await user.click(okButton);

      await waitFor(() => {
        expect(
          screen.queryByText("Employee Deleted Successfully")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("API Integration", () => {
    it("makes correct API call to fetch employees", async () => {
      mockFetchSuccess(mockEmployees);

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith("/api/employees");
      });
    });

    it("handles network errors gracefully", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to fetch employees: Network error/)
        ).toBeInTheDocument();
      });
    });

    it("handles non-200 HTTP responses", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValue({ message: "Server error" }),
      });

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText(/HTTP error! status: 500/)).toBeInTheDocument();
      });
    });
  });
});
