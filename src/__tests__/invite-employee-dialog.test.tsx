/** @jest-environment jsdom */
import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { InviteEmployeeDialog } from "@/components/employees/invite-employee-dialog";
jest.mock("@/components/ui/select", () => {
  const Select = ({
    children,
    value,
    onValueChange,
  }: {
    children?: React.ReactNode;
    value?: string;
    onValueChange?: (v: string) => void;
  }) => (
    <select
      data-testid="dept-select"
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
    >
      {children}
    </select>
  );
  const SelectTrigger = ({ children }: { children?: React.ReactNode }) => (
    <>{children}</>
  );
  const SelectValue = ({ placeholder }: { placeholder?: string }) => (
    <option value="">{placeholder}</option>
  );
  const SelectContent = ({ children }: { children?: React.ReactNode }) => (
    <>{children}</>
  );
  const SelectItem = ({
    value,
    children,
  }: {
    value: string;
    children?: React.ReactNode;
  }) => <option value={value}>{children}</option>;
  return {
    __esModule: true,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
  };
});

const refresh = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));

describe("InviteEmployeeDialog", () => {
  let fetchSpy: jest.Mock;
  beforeEach(() => {
    refresh.mockReset();
    fetchSpy = jest
      .fn()
      .mockResolvedValue({ json: async () => ({ ok: true, data: {} }) });
    Object.defineProperty(global, "fetch", { value: fetchSpy, writable: true });
  });

  it("submits form and calls /api/employees with payload", async () => {
    render(
      <InviteEmployeeDialog>
        <button>Invite Employee</button>
      </InviteEmployeeDialog>,
    );

    fireEvent.click(screen.getByText("Invite Employee"));

    fireEvent.change(screen.getByLabelText("First Name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText("Last Name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "john@corp.com" },
    });
    fireEvent.change(screen.getByTestId("dept-select"), {
      target: { value: "Engineering" },
    });
    fireEvent.change(screen.getByLabelText("Position"), {
      target: { value: "Engineer" },
    });

    fireEvent.click(screen.getByText("Send Invitation"));

    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    const [url, opts] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/employees");
    expect(opts.method).toBe("POST");
    const payload = JSON.parse(opts.body);
    expect(payload).toMatchObject({
      firstName: "John",
      lastName: "Doe",
      email: "john@corp.com",
      department: "Engineering",
      position: "Engineer",
    });

    await waitFor(() => expect(refresh).toHaveBeenCalled());
  });
});
