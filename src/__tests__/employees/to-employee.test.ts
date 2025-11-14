jest.mock("@/lib/data/supabase", () => ({ supabase: { from: jest.fn() } }));
import { toEmployee, type DbEmployee } from "@/lib/db/employees";

describe("toEmployee mapper", () => {
  const base: DbEmployee = {
    id: "1",
    name: "Alice Smith",
    email: "alice@corp.com",
    department: "Engineering",
    position: "Developer",
    status: "active",
    avatar: null,
    join_date: "2025-01-02T03:04:05.000Z",
    phone: null,
    location: null,
  };

  it("maps required fields and renames join_date to joinDate", () => {
    const e = toEmployee(base);
    expect(e.id).toBe(base.id);
    expect(e.name).toBe(base.name);
    expect(e.email).toBe(base.email);
    expect(e.department).toBe(base.department);
    expect(e.position).toBe(base.position);
    expect(e.status).toBe("active");
    expect(e.joinDate).toBe(base.join_date);
  });

  it("converts nullable optional fields to undefined", () => {
    const e = toEmployee({
      ...base,
      avatar: null,
      phone: null,
      location: null,
    });
    expect(e.avatar).toBeUndefined();
    expect(e.phone).toBeUndefined();
    expect(e.location).toBeUndefined();
  });

  it("preserves optional fields when provided", () => {
    const e = toEmployee({
      ...base,
      avatar: "https://cdn/avatar.png",
      phone: "+1-555-0100",
      location: "NYC",
    });
    expect(e.avatar).toBe("https://cdn/avatar.png");
    expect(e.phone).toBe("+1-555-0100");
    expect(e.location).toBe("NYC");
  });

  it("supports boundary status values active/inactive", () => {
    const e1 = toEmployee({ ...base, status: "active" });
    const e2 = toEmployee({ ...base, status: "inactive" });
    expect(e1.status).toBe("active");
    expect(e2.status).toBe("inactive");
  });

  it("produces a parseable ISO joinDate", () => {
    const e = toEmployee(base);
    const d = new Date(e.joinDate);
    expect(Number.isNaN(d.getTime())).toBe(false);
  });
});
