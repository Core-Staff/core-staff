import { validateAddEmployeeInput } from "@/components/employees/employee-header";
import { validateEditEmployeeInput } from "@/components/employees/edit-employee-dialog";

describe("employee field validation (frontend)", () => {
  it("add form: returns no errors for valid inputs", () => {
    const errors = validateAddEmployeeInput({
      name: "Alice Smith",
      email: "alice@corp.com",
      department: "Engineering",
      position: "Developer",
    });
    expect(Object.keys(errors).length).toBe(0);
  });

  it("add form: flags missing required fields", () => {
    const errors = validateAddEmployeeInput({
      name: "",
      email: "",
      department: "",
      position: "",
    });
    expect(errors.name).toBe("Name is required");
    expect(errors.email).toBe("Valid email is required");
    expect(errors.department).toBe("Department is required");
    expect(errors.position).toBe("Position is required");
  });

  it("add form: trims whitespace and validates email pattern", () => {
    const errors = validateAddEmployeeInput({
      name: "   Alice   ",
      email: "  bad-email  ",
      department: "  Engineering  ",
      position: "  Developer  ",
    });
    expect(errors.name).toBeUndefined();
    expect(errors.department).toBeUndefined();
    expect(errors.position).toBeUndefined();
    expect(errors.email).toBe("Valid email is required");
  });

  it("edit form: returns no errors for valid inputs", () => {
    const errors = validateEditEmployeeInput({
      name: "Bob Ross",
      email: "bob@corp.com",
      department: "HR",
      position: "Manager",
    });
    expect(Object.keys(errors).length).toBe(0);
  });

  it("edit form: flags missing required fields", () => {
    const errors = validateEditEmployeeInput({
      name: "",
      email: "",
      department: "",
      position: "",
    });
    expect(errors.name).toBe("Name is required");
    expect(errors.email).toBe("Valid email is required");
    expect(errors.department).toBe("Department is required");
    expect(errors.position).toBe("Position is required");
  });
});
