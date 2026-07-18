import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  MONGODB_URI: z.string().url(),

  // REDIS_URL: z.string(),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string(),

  SUPER_ADMIN_USERNAME: z.string().default("Super Admin"),
  SUPER_ADMIN_EMAIL: z.string().email(),
  SUPER_ADMIN_PASSWORD: z.string().min(8),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const parsed = envSchema.parse(process.env);

export const env = {
  port: parsed.PORT,
  mongoUri: parsed.MONGODB_URI,

  // redisUrl: parsed.REDIS_URL,

  jwtAccessSecret: parsed.JWT_ACCESS_SECRET,
  jwtRefreshSecret: parsed.JWT_REFRESH_SECRET,
  jwtAccessExpiresIn: parsed.JWT_ACCESS_EXPIRES_IN,
  jwtRefreshExpiresIn: parsed.JWT_REFRESH_EXPIRES_IN,

  superAdminUsername: parsed.SUPER_ADMIN_USERNAME,
  superAdminEmail: parsed.SUPER_ADMIN_EMAIL,
  superAdminPassword: parsed.SUPER_ADMIN_PASSWORD,

  nodeEnv: parsed.NODE_ENV,
};