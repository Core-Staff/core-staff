import { supabase } from "@/lib/data/supabase";
import bcrypt from "bcrypt";

// Database schema type for Users table
export type DbUser = {
  id: string;
  email: string;
  hashed_password: string;
  created_at: string;
};

// Public user type (without password)
export type User = {
  id: string;
  email: string;
  created_at: string;
};

// Create a new user
export async function createUser(
  email: string,
  password: string,
): Promise<{ ok: boolean; data?: User; error?: string }> {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("Users")
      .insert([{ email, hashed_password: hashedPassword }])
      .select("id, email, created_at")
      .single();

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
}

// Find user by email
export async function findUserByEmail(
  email: string,
): Promise<{ ok: boolean; data?: DbUser; error?: string }> {
  try {
    const { data, error } = await supabase
      .from("Users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned - user not found
        return { ok: false, error: "User not found" };
      }
      return { ok: false, error: error.message };
    }

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
}

// Verify user credentials
export async function verifyCredentials(
  email: string,
  password: string,
): Promise<{ ok: boolean; data?: User; error?: string }> {
  try {
    const userResult = await findUserByEmail(email);

    if (!userResult.ok || !userResult.data) {
      return { ok: false, error: "Invalid email or password" };
    }

    // Compare passwords
    const isValid = await bcrypt.compare(
      password,
      userResult.data.hashed_password,
    );

    if (!isValid) {
      return { ok: false, error: "Invalid email or password" };
    }

    // Return user without password
    const { hashed_password: _, ...user } = userResult.data;
    return { ok: true, data: user as User };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
}
