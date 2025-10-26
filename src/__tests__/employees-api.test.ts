import {
  GET as GETEmployees,
  POST as POSTEmployees,
} from "@/app/api/employees/route";
import {
  PUT as PUTEmployee,
  DELETE as DELETEEmployee,
} from "@/app/api/employees/[id]/route";

jest.mock("@/lib/data/supabase", () => {
  type DbEmployee = {
    id: string;
    name: string;
    email: string;
    department: string;
    position: string;
    status: string;
    avatar: unknown;
    join_date: string;
    phone: unknown;
    location: unknown;
  };
  const mockDb: DbEmployee[] = [
    {
      id: "1",
      name: "Test User",
      email: "test@corp.com",
      department: "Engineering",
      position: "Developer",
      status: "pending",
      avatar: null,
      join_date: new Date().toISOString(),
      phone: null,
      location: null,
    },
    {
      id: "2",
      name: "Jane Doe",
      email: "jane@corp.com",
      department: "HR",
      position: "HR Manager",
      status: "active",
      avatar: null,
      join_date: new Date().toISOString(),
      phone: null,
      location: null,
    },
  ];
  const supabase = {
    from: jest.fn((table: string) => {
      if (table !== "employees") throw new Error("unexpected_table");
      return {
        select: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: mockDb, error: null })),
          limit: jest.fn(() =>
            Promise.resolve({ data: mockDb.slice(0, 10), error: null }),
          ),
        })),
        insert: jest.fn((rows: Partial<DbEmployee>[]) => ({
          select: jest.fn(() => ({
            single: jest.fn(() => {
              const row = {
                id: String(mockDb.length + 1),
                ...rows[0],
              } as DbEmployee;
              mockDb.push(row);
              return Promise.resolve({ data: row, error: null });
            }),
          })),
        })),
        update: jest.fn((payload: Partial<DbEmployee>) => ({
          eq: jest.fn((_, id: string) => ({
            select: jest.fn(() => ({
              single: jest.fn(() => {
                const idx = mockDb.findIndex((e) => e.id === id);
                if (idx === -1)
                  return Promise.resolve({
                    data: null,
                    error: { message: "not_found" },
                  });
                const updated = { ...mockDb[idx], ...payload } as DbEmployee;
                mockDb[idx] = updated;
                return Promise.resolve({ data: updated, error: null });
              }),
            })),
          })),
        })),
        delete: jest.fn(() => ({
          eq: jest.fn((_, id: string) => {
            const idx = mockDb.findIndex((e) => e.id === id);
            if (idx !== -1) mockDb.splice(idx, 1);
            return Promise.resolve({ error: null });
          }),
        })),
      };
    }),
  };
  return { supabase };
});

describe("Employees API", () => {
  it("GET returns employees", async () => {
    const res = await GETEmployees();
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
  });

  it("POST validates payload", async () => {
    const req = new Request("http://localhost/api/employees", {
      method: "POST",
      body: JSON.stringify({ email: "x@y.com" }),
    });
    const res = await POSTEmployees(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.error).toBe("invalid_payload");
  });

  it("POST creates employee", async () => {
    const req = new Request("http://localhost/api/employees", {
      method: "POST",
      body: JSON.stringify({
        firstName: "John",
        lastName: "Smith",
        email: "john@corp.com",
        department: "Engineering",
        position: "Engineer",
      }),
    });
    const res = await POSTEmployees(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.data.name).toBe("John Smith");
  });

  it("PUT updates employee", async () => {
    const req = new Request("http://localhost/api/employees/1", {
      method: "PUT",
      body: JSON.stringify({ status: "active" }),
    });
    const res = await PUTEmployee(req, { params: { id: "1" } });
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.data.status).toBe("active");
  });

  it("DELETE removes employee", async () => {
    const req = new Request("http://localhost/api/employees/1", {
      method: "DELETE",
    });
    const res = await DELETEEmployee(req, { params: { id: "1" } });
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.data.id).toBe("1");
  });
});
