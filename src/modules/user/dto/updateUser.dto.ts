import { z } from "zod";
import { Types } from "mongoose";
import { UserRole } from "@/common/enums/user-role.enum";

export const updateUserSchema = z
  .object({
       username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters.")
      .max(30, "Username cannot exceed 30 characters.")
      .optional(),

    email: z
      .email("Invalid email address.")
      .transform((email) => email.toLowerCase().trim())
      .optional(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password cannot exceed 128 characters."  )
      .optional(),

    role: z.enum(UserRole).optional(),

    reportsTo: z
      .string()
      .refine((id) => Types.ObjectId.isValid(id), {
        message: "Invalid reportsTo id",
      })
      .nullable()
      .optional(),

    isActive: z.boolean().optional(),
  })
  .strict();

export type UpdateUserDto = z.infer<typeof updateUserSchema>;