import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmployeeLeaveRequestPage from "@/app/(leavePage)/leave-request/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("EmployeeLeaveRequestPage - Email Step", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render email input on initial load", () => {
    render(<EmployeeLeaveRequestPage />);
    const emailInputs = screen.getAllByRole("textbox");
    expect(emailInputs.length).toBeGreaterThan(0);
    expect(emailInputs[0]).toHaveAttribute("type", "email");
  });

  it("should display Continue button initially", () => {
    render(<EmployeeLeaveRequestPage />);
    const button = screen.getByRole("button", { name: /continue/i });
    expect(button).toBeInTheDocument();
  });

  it("should update email state on user input", async () => {
    render(<EmployeeLeaveRequestPage />);
    const emailInput = screen.getByDisplayValue("") as HTMLInputElement;

    await userEvent.type(emailInput, "test@example.com");
    expect(emailInput.value).toBe("test@example.com");
  });

  it("should call fetch with correct payload on email submit", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        id: "1",
        name: "John Doe",
        department: "Engineering",
      }),
    });

    render(<EmployeeLeaveRequestPage />);
    const emailInput = screen.getAllByRole("textbox")[0];
    const submitButton = screen.getByRole("button", { name: /continue/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/leave-requests/lookup",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "test@example.com" }),
        }),
      );
    });
  });

  it("should display error for 404 response", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      status: 404,
      ok: false,
    });

    render(<EmployeeLeaveRequestPage />);
    const emailInput = screen.getAllByRole("textbox")[0];
    const submitButton = screen.getByRole("button", { name: /continue/i });

    await userEvent.type(emailInput, "unknown@example.com");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("No employee found with that email."),
      ).toBeInTheDocument();
    });
  });

  it("should display error for failed lookup", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      status: 500,
      ok: false,
      json: async () => ({ error: "Server error" }),
    });

    render(<EmployeeLeaveRequestPage />);
    const emailInput = screen.getAllByRole("textbox")[0];
    const submitButton = screen.getByRole("button", { name: /continue/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Server error")).toBeInTheDocument();
    });
  });

  it("should show loading state on button during email lookup", async () => {
    global.fetch = jest.fn(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                status: 200,
                ok: true,
                json: async () => ({ id: "1", name: "John Doe" }),
              } as unknown as Response),
            100,
          ),
        ),
    );

    render(<EmployeeLeaveRequestPage />);
    const emailInput = screen.getAllByRole("textbox")[0];
    const submitButton = screen.getByRole("button", { name: /continue/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(submitButton);

    expect(
      screen.getByRole("button", { name: /checking/i }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /submit leave request/i }),
      ).toBeInTheDocument();
    });
  });

  it("should handle network errors during email lookup", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));

    render(<EmployeeLeaveRequestPage />);
    const emailInput = screen.getAllByRole("textbox")[0];
    const submitButton = screen.getByRole("button", { name: /continue/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });
});

describe("EmployeeLeaveRequestPage - Form Step", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should display form after successful email lookup", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        id: "1",
        name: "John Doe",
        department: "Engineering",
      }),
    });

    render(<EmployeeLeaveRequestPage />);
    const emailInput = screen.getAllByRole("textbox")[0];
    const continueButton = screen.getByRole("button", { name: /continue/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(continueButton);

    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      expect(screen.getByText(/engineering/i)).toBeInTheDocument();
    });
  });

  it("should display employee name and department on form", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({ id: "1", name: "Jane Smith", department: "HR" }),
    });

    render(<EmployeeLeaveRequestPage />);
    const emailInput = screen.getAllByRole("textbox")[0];
    const continueButton = screen.getByRole("button", { name: /continue/i });

    await userEvent.type(emailInput, "jane@example.com");
    await userEvent.click(continueButton);

    await waitFor(() => {
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      // Department text is split across multiple elements, so check for the text in the paragraph
      expect(screen.getByText(/Department:/)).toBeInTheDocument();
    });
  });

  it("should have start date pre-filled with today", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({ id: "1", name: "John Doe" }),
    });

    render(<EmployeeLeaveRequestPage />);
    const emailInput = screen.getAllByRole("textbox")[0];
    const continueButton = screen.getByRole("button", { name: /continue/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(continueButton);

    await waitFor(() => {
      const today = new Date();
      const expectedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      const dateInputs = screen.getAllByDisplayValue(expectedDate);
      expect(dateInputs.length).toBeGreaterThan(0);
    });
  });

  it("should allow user to change start date", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({ id: "1", name: "John Doe" }),
    });

    render(<EmployeeLeaveRequestPage />);
    const emailInput = screen.getAllByRole("textbox")[0];
    const continueButton = screen.getByRole("button", { name: /continue/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(continueButton);

    await waitFor(() => {
      const dateInputs = screen.getAllByDisplayValue(/\d{4}-\d{2}-\d{2}/);
      expect(dateInputs.length).toBeGreaterThan(0);
    });
  });

  it("should display Back button on form step", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({ id: "1", name: "John Doe" }),
    });

    render(<EmployeeLeaveRequestPage />);
    const emailInput = screen.getAllByRole("textbox")[0];
    const continueButton = screen.getByRole("button", { name: /continue/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(continueButton);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
    });
  });

  it("should return to email step when Back button is clicked", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({ id: "1", name: "John Doe" }),
    });

    render(<EmployeeLeaveRequestPage />);
    const emailInput = screen.getAllByRole("textbox")[0];
    const continueButton = screen.getByRole("button", { name: /continue/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(continueButton);

    await waitFor(() => {
      const backButton = screen.getByRole("button", { name: /back/i });
      fireEvent.click(backButton);
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /continue/i }),
      ).toBeInTheDocument();
    });
  });

  it("should display error if submission fails", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: async () => ({ id: "1", name: "John Doe" }),
      })
      .mockResolvedValueOnce({
        status: 400,
        ok: false,
        json: async () => ({ error: "Invalid dates" }),
      });

    render(<EmployeeLeaveRequestPage />);
    const emailInput = screen.getAllByRole("textbox")[0];
    const continueButton = screen.getByRole("button", { name: /continue/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(continueButton);

    await waitFor(() => {
      const submitButton = screen.getByRole("button", {
        name: /submit leave request/i,
      });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Invalid dates")).toBeInTheDocument();
    });
  });
});

describe("EmployeeLeaveRequestPage - Success Step", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should show success message after successful submission", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: async () => ({ id: "1", name: "John Doe" }),
      })
      .mockResolvedValueOnce({
        status: 201,
        ok: true,
        json: async () => ({}),
      });

    render(<EmployeeLeaveRequestPage />);
    const emailInput = screen.getAllByRole("textbox")[0];
    const continueButton = screen.getByRole("button", { name: /continue/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(continueButton);

    await waitFor(() => {
      const submitButton = screen.getByRole("button", {
        name: /submit leave request/i,
      });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          /your leave request was submitted successfully and is pending approval/i,
        ),
      ).toBeInTheDocument();
    });
  });

  it("should display Done button on success", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: async () => ({ id: "1", name: "John Doe" }),
      })
      .mockResolvedValueOnce({
        status: 201,
        ok: true,
        json: async () => ({}),
      });

    render(<EmployeeLeaveRequestPage />);
    const emailInput = screen.getAllByRole("textbox")[0];
    const continueButton = screen.getByRole("button", { name: /continue/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(continueButton);

    await waitFor(() => {
      const submitButton = screen.getByRole("button", {
        name: /submit leave request/i,
      });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /done/i })).toBeInTheDocument();
    });
  });
});
