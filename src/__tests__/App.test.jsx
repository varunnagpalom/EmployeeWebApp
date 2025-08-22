import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import CreateEmployee from "../components/CreateEmployee";
import EditEmployee from "../components/EditEmployee";
import { mockEmployees, mockFetchSuccess } from "../test/utils.jsx";

// Helper function to render components with routing
const renderWithRouter = (initialEntries = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create-employee" element={<CreateEmployee />} />
        <Route path="/edit-employee" element={<EditEmployee />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("App Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Routing", () => {
    it("renders Dashboard component on root path", async () => {
      mockFetchSuccess(mockEmployees);

      renderWithRouter();

      await waitFor(() => {
        expect(
          screen.getByText("Employee Management Portal")
        ).toBeInTheDocument();
      });
    });

    it("navigates from Dashboard to Create Employee page", async () => {
      mockFetchSuccess(mockEmployees);
      const user = userEvent.setup();

      renderWithRouter();

      await waitFor(() => {
        expect(
          screen.getByText("Employee Management Portal")
        ).toBeInTheDocument();
      });

      const createButton = screen.getByRole("button", {
        name: /create employee/i,
      });
      await user.click(createButton);

      await waitFor(() => {
        expect(screen.getByText("Create Employee")).toBeInTheDocument();
      });
    });

    it("navigates from Dashboard to Edit Employee page", async () => {
      mockFetchSuccess(mockEmployees);
      const user = userEvent.setup();

      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      const editButtons = screen.getAllByRole("button", { name: /edit/i });
      await user.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByText("Edit Employee")).toBeInTheDocument();
      });
    });

    it("shows no employee data message when navigating directly to edit page", async () => {
      // Test EditEmployee component with router but without state
      render(
        <MemoryRouter initialEntries={["/edit-employee"]} initialIndex={0}>
          <Routes>
            <Route path="/edit-employee" element={<EditEmployee />} />
          </Routes>
        </MemoryRouter>
      );

      // The edit employee component should render
      expect(screen.getByText("No Employee Data")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Please select an employee from the dashboard to edit."
        )
      ).toBeInTheDocument();
    });
  });

  describe("End-to-End Workflows", () => {
    it("completes create employee workflow", async () => {
      mockFetchSuccess(mockEmployees);
      const user = userEvent.setup();

      renderWithRouter();

      // Navigate to create page
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /create employee/i })
        ).toBeInTheDocument();
      });

      const createButton = screen.getByRole("button", {
        name: /create employee/i,
      });
      await user.click(createButton);

      // Fill and submit form
      await waitFor(() => {
        expect(screen.getByText("Create Employee")).toBeInTheDocument();
      });

      await user.type(screen.getByLabelText(/name/i), "New Employee");
      await user.type(screen.getByLabelText(/date of joining/i), "2025-08-22");
      await user.selectOptions(screen.getByLabelText(/department/i), "HR");
      await user.type(screen.getByLabelText(/salary/i), "60000");
      await user.type(screen.getByLabelText(/manager id/i), "2");

      // Mock successful creation
      fetch.mockResolvedValueOnce({ status: 201 });

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Employee Created Successfully")
        ).toBeInTheDocument();
      });

      // Navigate back to dashboard
      const goBackButton = screen.getByRole("button", { name: /go back/i });
      await user.click(goBackButton);

      await waitFor(() => {
        expect(
          screen.getByText("Employee Management Portal")
        ).toBeInTheDocument();
      });
    });

    it("completes edit employee workflow", async () => {
      mockFetchSuccess(mockEmployees);
      const user = userEvent.setup();

      renderWithRouter();

      // Wait for dashboard to load
      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      // Navigate to edit page
      const editButtons = screen.getAllByRole("button", { name: /edit/i });
      await user.click(editButtons[0]);

      // Edit form
      await waitFor(() => {
        expect(screen.getByText("Edit Employee")).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/name/i);
      await user.clear(nameInput);
      await user.type(nameInput, "Updated John Doe");

      // Mock successful update
      fetch.mockResolvedValueOnce({ status: 200 });

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Employee Data Modified Successfully")
        ).toBeInTheDocument();
      });

      // Navigate back to dashboard
      const goBackButton = screen.getByRole("button", { name: /go back/i });
      await user.click(goBackButton);

      await waitFor(() => {
        expect(
          screen.getByText("Employee Management Portal")
        ).toBeInTheDocument();
      });
    });

    it("completes delete employee workflow", async () => {
      mockFetchSuccess(mockEmployees);
      const user = userEvent.setup();

      renderWithRouter();

      // Wait for dashboard to load
      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      // Mock successful delete and refresh
      fetch.mockResolvedValueOnce({ status: 204 });
      mockFetchSuccess(mockEmployees.slice(1));

      // Delete employee
      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(
          screen.getByText("Employee Deleted Successfully")
        ).toBeInTheDocument();
      });

      // Close modal
      const okButton = screen.getByRole("button", { name: /ok/i });
      await user.click(okButton);

      await waitFor(() => {
        expect(
          screen.queryByText("Employee Deleted Successfully")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Error Handling Integration", () => {
    it("handles API errors across different pages", async () => {
      // Mock API failure for dashboard
      fetch.mockRejectedValueOnce(new Error("Server down"));
      const user = userEvent.setup();

      renderWithRouter();

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to fetch employees/)
        ).toBeInTheDocument();
      });

      // Navigate to create page (should still work)
      const createButton = screen.getByRole("button", {
        name: /create employee/i,
      });
      await user.click(createButton);

      await waitFor(() => {
        expect(screen.getByText("Create Employee")).toBeInTheDocument();
      });

      // Try to create employee with API failure
      await user.type(screen.getByLabelText(/name/i), "Test Employee");
      await user.type(screen.getByLabelText(/date of joining/i), "2025-08-22");
      await user.selectOptions(screen.getByLabelText(/department/i), "IT");
      await user.type(screen.getByLabelText(/salary/i), "50000");
      await user.type(screen.getByLabelText(/manager id/i), "1");

      fetch.mockRejectedValueOnce(new Error("Create failed"));

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to create employee/)
        ).toBeInTheDocument();
      });
    });
  });

  describe("State Management Across Navigation", () => {
    it("maintains form state when navigating back and forth", async () => {
      mockFetchSuccess(mockEmployees);
      const user = userEvent.setup();

      renderWithRouter();

      // Navigate to create page
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /create employee/i })
        ).toBeInTheDocument();
      });

      const createButton = screen.getByRole("button", {
        name: /create employee/i,
      });
      await user.click(createButton);

      // Fill partial form
      await waitFor(() => {
        expect(screen.getByText("Create Employee")).toBeInTheDocument();
      });

      await user.type(screen.getByLabelText(/name/i), "Partial Employee");

      // Cancel back to dashboard
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(
          screen.getByText("Employee Management Portal")
        ).toBeInTheDocument();
      });

      // Navigate back to create page (should be reset)
      const createButton2 = screen.getByRole("button", {
        name: /create employee/i,
      });
      await user.click(createButton2);

      await waitFor(() => {
        expect(screen.getByLabelText(/name/i).value).toBe("");
      });
    });
  });
});
