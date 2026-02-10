
"use server";

import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function register(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const parsed = registerSchema.safeParse(data);

  if (!parsed.success) {
    return { error: "Invalid input data" };
  }

  const { name, email, password } = parsed.data;

  // Check if user exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    return { error: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
    });
  } catch (error) {
    return { error: "Failed to create user" };
  }

  return { success: true };
}
