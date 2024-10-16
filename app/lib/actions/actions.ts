"use server";

// Shift this to video articles actions.ts and game links to game links actions.ts inside a folder actions.ts

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { db } from "@vercel/postgres";
import { z } from "zod";

import { v4 as uuidv4 } from "uuid";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong";
      }
    }
    throw error;
  }
}

export async function insertUser(
  prevState: string | undefined,
  formData: FormData
): Promise<string | { success: boolean }> {
  try {
    const formValues = {
      userId: uuidv4(),
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      otp: formData.get("otp"),
    };
    const parsedCredentials = z
      .object({
        userId: z.string(),
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
        otp: z.string().optional(),
      })
      .safeParse(formValues);
    if (!parsedCredentials.success) {
      throw new Error("Validatation failed");
    }
    const { userId, name, email, password } = parsedCredentials.data;
    const client = await db.connect();
    const insertedUser =
      await client.sql`INSERT INTO users(user_id, name, email, password) VALUES (${userId}, ${name}, ${email}, ${password}) ON CONFLICT (email) DO NOTHING;`;
    if (insertedUser?.rowCount && insertedUser.rowCount > 0) {
      return { success: true };
    } else {
      return "User already exists or could not be inserted.";
    }
  } catch (error) {
    return "Something went wrong";
  }
}
