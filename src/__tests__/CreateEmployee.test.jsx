import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateEmployee from "../components/CreateEmployee";
import { renderWithRouter } from "../test/utils.jsx";

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("CreateEmployee Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Component Rendering", () => {
    it("renders create employee form with all required fields", () => {
      renderWithRouter(<CreateEmployee />);

      expect(screen.getByText("Create Employee")).toBeInTheDocument();

      // Check all form fields
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date of joining/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/salary/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/manager id/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument();

      // Check buttons
      expect(
        screen.getByRole("button", { name: /cancel/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /submit/i })
      ).toBeInTheDocument();
    });

    it("renders department dropdown with correct options", () => {
      renderWithRouter(<CreateEmployee />);

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

    it("renders status dropdown with correct options", () => {
      renderWithRouter(<CreateEmployee />);

      const statusSelect = screen.getByLabelText(/status/i);
      expect(statusSelect).toBeInTheDocument();

      expect(
        screen.getByRole("option", { name: "ACTIVE" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: "NOT_ACTIVE" })
      ).toBeInTheDocument();
    });

    it("has ACTIVE as default status", () => {
      renderWithRouter(<CreateEmployee />);

      const statusSelect = screen.getByLabelText(/status/i);
      expect(statusSelect.value).toBe("ACTIVE");
    });
  });

  describe("Form Interactions", () => {
    it("updates form fields when user types", async () => {
      const user = userEvent.setup();
      renderWithRouter(<CreateEmployee />);

      const nameInput = screen.getByLabelText(/name/i);
      const salaryInput = screen.getByLabelText(/salary/i);
      const managerIdInput = screen.getByLabelText(/manager id/i);

      await user.type(nameInput, "John Doe");
      await user.type(salaryInput, "75000.50");
      await user.type(managerIdInput, "1");

      expect(nameInput.value).toBe("John Doe");
      expect(salaryInput.value).toBe("75000.5");
      expect(managerIdInput.value).toBe("1");
    });

    it("updates dropdown selections", async () => {
      const user = userEvent.setup();
      renderWithRouter(<CreateEmployee />);

      const departmentSelect = screen.getByLabelText(/department/i);
      const statusSelect = screen.getByLabelText(/status/i);

      await user.selectOptions(departmentSelect, "IT");
      await user.selectOptions(statusSelect, "NOT_ACTIVE");

      expect(departmentSelect.value).toBe("IT");
      expect(statusSelect.value).toBe("NOT_ACTIVE");
    });

    it("clears error message when user starts typing", async () => {
      const user = userEvent.setup();

      // Mock failed submission first
      fetch.mockResolvedValueOnce({ status: 500 });

      renderWithRouter(<CreateEmployee />);

      // Fill form and submit to generate error
      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/date of joining/i), "2025-08-22");
      await user.selectOptions(screen.getByLabelText(/department/i), "IT");
      await user.type(screen.getByLabelText(/salary/i), "75000");
      await user.type(screen.getByLabelText(/manager id/i), "1");

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to create employee/)
        ).toBeInTheDocument();
      });

      // Start typing to clear error
      await user.type(screen.getByLabelText(/name/i), " Updated");

      await waitFor(() => {
        expect(
          screen.queryByText(/Failed to create employee/)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Form Submission", () => {
    const fillValidForm = async (user) => {
      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/date of joining/i), "2025-08-22");
      await user.selectOptions(screen.getByLabelText(/department/i), "IT");
      await user.type(screen.getByLabelText(/salary/i), "75000.50");
      await user.type(screen.getByLabelText(/manager id/i), "1");
      await user.selectOptions(screen.getByLabelText(/status/i), "ACTIVE");
    };

    it("successfully creates employee and shows success modal", async () => {
      const user = userEvent.setup();

      // Mock successful API response
      fetch.mockResolvedValueOnce({ status: 201 });

      renderWithRouter(<CreateEmployee />);

      await fillValidForm(user);
      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Employee Created Successfully")
        ).toBeInTheDocument();
      });

      // Check API call
      expect(fetch).toHaveBeenCalledWith("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "John Doe",
          dateOfJoining: "2025-08-22T00:00:00.000Z",
          department: "IT",
          salary: 75000.5,
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
            setTimeout(() => resolve({ status: 201 }), 100);
          })
      );

      renderWithRouter(<CreateEmployee />);

      await fillValidForm(user);
      await user.click(screen.getByRole("button", { name: /submit/i }));

      expect(screen.getByText("Creating...")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /creating.../i })
      ).toBeDisabled();
    });

    it("displays error message when submission fails", async () => {
      const user = userEvent.setup();

      // Mock failed API response
      fetch.mockResolvedValueOnce({ status: 500 });

      renderWithRouter(<CreateEmployee />);

      await fillValidForm(user);
      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to create employee/)
        ).toBeInTheDocument();
      });
    });

    it("handles network errors", async () => {
      const user = userEvent.setup();

      // Mock network error
      fetch.mockRejectedValueOnce(new Error("Network error"));

      renderWithRouter(<CreateEmployee />);

      await fillValidForm(user);
      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to create employee.*Network error/)
        ).toBeInTheDocument();
      });
    });

    it("prevents submission with invalid data", async () => {
      const user = userEvent.setup();
      renderWithRouter(<CreateEmployee />);

      // Try to submit empty form
      await user.click(screen.getByRole("button", { name: /submit/i }));

      // Form should prevent submission due to required fields
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  describe("Success Modal Actions", () => {
    const setupSuccessModal = async () => {
      const user = userEvent.setup();

      fetch.mockResolvedValueOnce({ status: 201 });

      renderWithRouter(<CreateEmployee />);

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/date of joining/i), "2025-08-22");
      await user.selectOptions(screen.getByLabelText(/department/i), "IT");
      await user.type(screen.getByLabelText(/salary/i), "75000");
      await user.type(screen.getByLabelText(/manager id/i), "1");

      await user.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Employee Created Successfully")
        ).toBeInTheDocument();
      });

      return user;
    };

    it('clears form when "Create New Employee" is clicked', async () => {
      const user = await setupSuccessModal();

      const createNewButton = screen.getByRole("button", {
        name: /create new employee/i,
      });
      await user.click(createNewButton);

      // Modal should close
      await waitFor(() => {
        expect(
          screen.queryByText("Employee Created Successfully")
        ).not.toBeInTheDocument();
      });

      // Form should be cleared
      expect(screen.getByLabelText(/name/i).value).toBe("");
      expect(screen.getByLabelText(/salary/i).value).toBe("");
      expect(screen.getByLabelText(/manager id/i).value).toBe("");
      expect(screen.getByLabelText(/status/i).value).toBe("ACTIVE");
    });

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
      renderWithRouter(<CreateEmployee />);

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
            setTimeout(() => resolve({ status: 201 }), 100);
          })
      );

      renderWithRouter(<CreateEmployee />);

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/date of joining/i), "2025-08-22");
      await user.selectOptions(screen.getByLabelText(/department/i), "IT");
      await user.type(screen.getByLabelText(/salary/i), "75000");
      await user.type(screen.getByLabelText(/manager id/i), "1");

      await user.click(screen.getByRole("button", { name: /submit/i }));

      expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
      expect(
        screen.getByRole("button", { name: /creating.../i })
      ).toBeDisabled();
    });
  });
});
