/** @jest-environment jsdom */
import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { EmployeeList } from "@/components/employees/employee-list";
import type { Employee } from "@/types/employee";

const refresh = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));

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
      data-testid="mock-select"
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

describe("EmployeeList actions", () => {
  let fetchSpy: jest.Mock;
  const employees: Employee[] = [
    {
      id: "1",
      name: "Alice Smith",
      email: "alice@corp.com",
      department: "Engineering",
      position: "Developer",
      status: "active",
      joinDate: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    refresh.mockReset();
    fetchSpy = jest
      .fn()
      .mockResolvedValue({ json: async () => ({ ok: true, data: {} }) });
    Object.defineProperty(global, "fetch", { value: fetchSpy, writable: true });
  });

  it("allows editing an employee and calls PUT", async () => {
    render(<EmployeeList employees={employees} />);

    const trigger = screen.getByLabelText("Actions");
    fireEvent.keyDown(trigger, { key: "Enter" });
    fireEvent.click(screen.getByText(/Edit/i));

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Alice S." },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "alice.s@corp.com" },
    });
    fireEvent.change(screen.getByLabelText("Position"), {
      target: { value: "Senior Developer" },
    });
    fireEvent.change(screen.getAllByTestId("mock-select")[0], {
      target: { value: "Engineering" },
    });
    fireEvent.change(screen.getAllByTestId("mock-select")[1], {
      target: { value: "active" },
    });

    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    const [url, opts] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/employees/1");
    expect(opts.method).toBe("PUT");
    const body = JSON.parse(opts.body as string);
    expect(body).toMatchObject({
      name: "Alice S.",
      email: "alice.s@corp.com",
      position: "Senior Developer",
    });
    await waitFor(() => expect(refresh).toHaveBeenCalled());
  });

  it("allows deleting an employee and calls DELETE", async () => {
    render(<EmployeeList employees={employees} />);
    const trigger2 = screen.getByLabelText("Actions");
    fireEvent.keyDown(trigger2, { key: "Enter" });
    fireEvent.click(screen.getByText(/Delete/i));

    const deleteButtons = screen.getAllByText(/Delete$/);
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);

    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    const [url, opts] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/employees/1");
    expect(opts.method).toBe("DELETE");
    await waitFor(() => expect(refresh).toHaveBeenCalled());
  });
});
