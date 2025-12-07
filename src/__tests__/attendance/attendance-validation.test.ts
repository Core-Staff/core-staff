import { validateEditAttendanceInput } from "@/components/attendance/attendance-list";

describe("attendance edit validation (frontend)", () => {
  it("returns no errors for same-day and after-in", () => {
    const errs = validateEditAttendanceInput({
      clockInLocal: "2025-11-22T09:00",
      clockOutLocal: "2025-11-22T10:15",
    });
    expect(Object.keys(errs).length).toBe(0);
  });

  it("flags when clock out is before or equal clock in", () => {
    const beforeErrs = validateEditAttendanceInput({
      clockInLocal: "2025-11-22T10:00",
      clockOutLocal: "2025-11-22T09:59",
    });
    expect(beforeErrs.clockOut).toBe("Clock out must be after clock in");

    const equalErrs = validateEditAttendanceInput({
      clockInLocal: "2025-11-22T10:00",
      clockOutLocal: "2025-11-22T10:00",
    });
    expect(equalErrs.clockOut).toBe("Clock out must be after clock in");
  });

  it("flags when clock out is on a different day", () => {
    const errs = validateEditAttendanceInput({
      clockInLocal: "2025-11-22T10:00",
      clockOutLocal: "2025-11-23T09:00",
    });
    expect(errs.clockOut).toBe("Clock out must be same day as clock in");
  });

  it("allows blank clock out (no error)", () => {
    const errs = validateEditAttendanceInput({
      clockInLocal: "2025-11-22T10:00",
      clockOutLocal: "",
    });
    expect(Object.keys(errs).length).toBe(0);
  });
});
