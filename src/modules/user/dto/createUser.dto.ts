import { z } from "zod";
import { Types } from "mongoose";
import { UserRole } from "@/common";

export const createUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(30, "Username cannot exceed 30 characters."),

  email: z
    .email("Invalid email address.")
    .transform((email) => email.toLowerCase().trim()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password cannot exceed 128 characters."),


  role: z.enum(UserRole),

  reportsTo: z
    .string()
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "Invalid reportsTo id",
    })
    .nullable()
    .optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;