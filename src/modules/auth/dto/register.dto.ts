import { z } from "zod";

import { UserRole } from "@/common/enums/user-role.enum";

export const registerSchema = z.object({
  username: z.string().trim().min(3).max(30),

  email: z.email().transform((v) =>
    v.toLowerCase().trim()
  ),

  password: z.string().min(8).max(128),

  role: z.nativeEnum(UserRole),
});

export type RegisterDto =
  z.infer<typeof registerSchema>;