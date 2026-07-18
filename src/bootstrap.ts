import bcrypt from "bcrypt";

import { env } from "@/config/env";
import { UserRole } from "@/common/enums/user-role.enum";
import { UserModel } from "@/modules/user/user.model";

export async function bootstrapSuperAdmin(): Promise<void> {
  const existing = await UserModel.findOne({
    role: UserRole.SUPER_ADMIN,
  }).exec();

  if (existing) {
    return;
  }

  const password = await bcrypt.hash(env.superAdminPassword, 10);

  await UserModel.create({
    username: env.superAdminUsername,
    email: env.superAdminEmail,
    password,
    role: UserRole.SUPER_ADMIN,
    isActive: true,
    reportsTo: null,
  });

  console.log("✅ Super Admin created");
}