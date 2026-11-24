import { z } from "zod";

const envSchema = z.object({
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  NEXTAUTH_URL: z.string().url().optional().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

export const env = {
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "docspace_super_secret_session_token_key_12345",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/docspace?schema=public",
};
