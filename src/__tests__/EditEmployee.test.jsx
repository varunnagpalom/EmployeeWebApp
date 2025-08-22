import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import EditEmployee from '../components/EditEmployee'
import { mockEmployees } from '../test/utils.jsx'

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Custom render function for EditEmployee with state
const renderEditEmployee = (employee = mockEmployees[0]) => {
  return render(
    <MemoryRouter
      initialEntries={[{ pathname: "/edit-employee", state: { employee } }]}
    >
      <EditEmployee />
    </MemoryRouter>
  );
};

describe("EditEmployee Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Component Rendering", () => {
    it("renders edit employee form with pre-filled data", () => {
      renderEditEmployee();

      expect(screen.getByText("Edit Employee")).toBeInTheDocument();

      // Check employee info display
      expect(screen.getByText("Employee ID:")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("Date of Joining:")).toBeInTheDocument();
      expect(screen.getByText("8/18/2025")).toBeInTheDocument();

      // Check form fields are pre-filled
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
      expect(screen.getByDisplayValue("IT")).toBeInTheDocument();
      expect(screen.getByDisplayValue("80000")).toBeInTheDocument();
      expect(screen.getByDisplayValue("1")).toBeInTheDocument();
      expect(screen.getByDisplayValue("ACTIVE")).toBeInTheDocument();
    });

    it("renders all form fields and buttons", () => {
      renderEditEmployee();

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/salary/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/manager id/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /cancel/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /submit/i })
      ).toBeInTheDocument();
    });

    it("does not render Employee ID and Date of Joining as editable fields", () => {
      renderEditEmployee();

      // These should not be input fields
      expect(screen.queryByLabelText(/employee id/i)).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(/date of joining/i)
      ).not.toBeInTheDocument();

      // But should be displayed as read-only info
      expect(screen.getByText("Employee ID:")).toBeInTheDocument();
      expect(screen.getByText("Date of Joining:")).toBeInTheDocument();
    });

    it("renders department dropdown with correct options", () => {
      renderEditEmployee();

      const departmentSelect = screen.getByLabelText(/department/i);
      expect(departmentSelect).toBeInTheDocument();

      const options = screen.getAllByRole("option");
      const departmentOptions = options.filter((option) =>
        ["HR", "IT", "Finance", "Sales", "Marketing"].includes(
          option.textContent
        )
      );

      expect(departmentOptions).toHaveLength(5);
    });
  });

  describe("No Employee Data Handling", () => {
    it("renders error message when no employee data is provided", () => {
      render(
        <MemoryRouter initialEntries={["/edit-employee"]}>
          <EditEmployee />
        </MemoryRouter>
      );

      expect(screen.getByText("No Employee Data")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Please select an employee from the dashboard to edit."
        )
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /go back to dashboard/i })
      ).toBeInTheDocument();
    });

    it("navigates to dashboard when no employee data and back button clicked", async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={["/edit-employee"]}>
          <EditEmployee />
        </MemoryRouter>
      );

      const backButton = screen.getByRole("button", {
        name: /go back to dashboard/i,
      });
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  describe("Form Interactions", () => {
    it("updates form fields when user edits", async () => {
      const user = userEvent.setup();
      renderEditEmployee();

      const nameInput = screen.getByLabelText(/name/i);
      const salaryInput = screen.getByLabelText(/salary/i);

      // Clear and type new values
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Name");

      await user.clear(salaryInput);
      await user.type(salaryInput, "90000");

      expect(nameInput.value).toBe("Updated Name");
      expect(salaryInput.value).toBe("90000");
    });

    it("updates dropdown selections", async () => {
      const user = userEvent.setup();
      renderEditEmployee();

      const departmentSelect = screen.getByLabelText(/department/i);
      const statusSelect = screen.getByLabelText(/status/i);

      await user.selectOptions(departmentSelect, "Finance");
      await user.selectOptions(statusSelect, "NOT_ACTIVE");

      expect(departmentSelect.value).toBe("Finance");
      expect(statusSelect.value).toBe("NOT_ACTIVE");
    });

    it("clears error message when user starts editing", async () => {
      const user = userEvent.setup();

      // Mock failed submission first
      fetch.mockResolvedValueOnce({ status: 500 });

      renderEditEmployee();

      // Submit to generate error
      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/Failed to edit employee/)).toBeInTheDocument();
      });

      // Start editing to clear error
      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, " Updated");

      await waitFor(() => {
        expect(
          screen.queryByText(/Failed to edit employee/)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Form Submission", () => {
    it("successfully updates employee and shows success modal", async () => {
      const user = userEvent.setup();

      // Mock successful API response
      fetch.mockResolvedValueOnce({ status: 200 });

      renderEditEmployee();

      // Update some fields
      const nameInput = screen.getByLabelText(/name/i);
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Name");

      const departmentSelect = screen.getByLabelText(/department/i);
      await user.selectOptions(departmentSelect, "Finance");

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Employee Data Modified Successfully")
        ).toBeInTheDocument();
      });

      // Check API call
      expect(fetch).toHaveBeenCalledWith("/api/employees/1", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Updated Name",
          department: "Finance",
          salary: 80000,
          managerId: 1,
          status: "ACTIVE",
        }),
      });
    });

    it("shows loading state during submission", async () => {
      const user = userEvent.setup();

      // Mock slow API response
      fetch.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ status: 200 }), 100);
          })
      );

      renderEditEmployee();

      await user.click(screen.getByRole("button", { name: /submit/i }));

      expect(screen.getByText("Updating...")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /updating.../i })
      ).toBeDisabled();
    });

    it("displays error message when submission fails", async () => {
      const user = userEvent.setup();

      // Mock failed API response
      fetch.mockResolvedValueOnce({ status: 500 });

      renderEditEmployee();

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/Failed to edit employee/)).toBeInTheDocument();
      });
    });

    it("handles network errors", async () => {
      const user = userEvent.setup();

      // Mock network error
      fetch.mockRejectedValueOnce(new Error("Network error"));

      renderEditEmployee();

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to edit employee.*Network error/)
        ).toBeInTheDocument();
      });
    });

    it("uses correct employee ID in API call", async () => {
      const user = userEvent.setup();

      // Test with different employee
      const testEmployee = { ...mockEmployees[1], id: 5 };

      render(
        <MemoryRouter
          initialEntries={[
            { pathname: "/edit-employee", state: { employee: testEmployee } },
          ]}
        >
          <EditEmployee />
        </MemoryRouter>
      );

      fetch.mockResolvedValueOnce({ status: 200 });

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          "/api/employees/5",
          expect.any(Object)
        );
      });
    });
  });

  describe("Success Modal Actions", () => {
    const setupSuccessModal = async () => {
      const user = userEvent.setup();

      fetch.mockResolvedValueOnce({ status: 200 });

      renderEditEmployee();

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Employee Data Modified Successfully")
        ).toBeInTheDocument();
      });

      return user;
    };

    it('navigates back when "Go Back" is clicked', async () => {
      const user = await setupSuccessModal();

      const goBackButton = screen.getByRole("button", { name: /go back/i });
      await user.click(goBackButton);

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  describe("Navigation", () => {
    it("navigates back to dashboard when cancel is clicked", async () => {
      const user = userEvent.setup();
      renderEditEmployee();

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("disables buttons during loading", async () => {
      const user = userEvent.setup();

      // Mock slow API response
      fetch.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ status: 200 }), 100);
          })
      );

      renderEditEmployee();

      await user.click(screen.getByRole("button", { name: /submit/i }));

      expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
      expect(
        screen.getByRole("button", { name: /updating.../i })
      ).toBeDisabled();
    });
  });

  describe("Data Pre-filling Edge Cases", () => {
    it("handles missing salary value", () => {
      const employeeWithoutSalary = { ...mockEmployees[0], salary: undefined };

      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/edit-employee",
              state: { employee: employeeWithoutSalary },
            },
          ]}
        >
          <EditEmployee />
        </MemoryRouter>
      );

      const salaryInput = screen.getByLabelText(/salary/i);
      expect(salaryInput.value).toBe("");
    });

    it("handles missing managerId value", () => {
      const employeeWithoutManagerId = {
        ...mockEmployees[0],
        managerId: undefined,
      };

      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/edit-employee",
              state: { employee: employeeWithoutManagerId },
            },
          ]}
        >
          <EditEmployee />
        </MemoryRouter>
      );

      const managerIdInput = screen.getByLabelText(/manager id/i);
      expect(managerIdInput.value).toBe("");
    });

    it("defaults to ACTIVE status if status is missing", () => {
      const employeeWithoutStatus = { ...mockEmployees[0], status: undefined };

      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/edit-employee",
              state: { employee: employeeWithoutStatus },
            },
          ]}
        >
          <EditEmployee />
        </MemoryRouter>
      );

      const statusSelect = screen.getByLabelText(/status/i);
      expect(statusSelect.value).toBe("ACTIVE");
    });
  });
});
