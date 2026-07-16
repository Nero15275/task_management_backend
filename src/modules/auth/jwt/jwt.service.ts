import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

import {env} from "@/config";
import { UserRole } from "@/common/enums/user-role.enum";

if (
  !env.jwtAccessSecret ||
  !env.jwtRefreshSecret ||
  !env.jwtAccessExpiresIn ||
  !env.jwtRefreshExpiresIn
) {
  throw new Error("JWT environment variables are missing.");
}

export interface JwtUserPayload {
  sub: string;
  role: UserRole;
}

export function generateAccessToken(
  payload: JwtUserPayload
): string {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn,
  } as SignOptions);
}

export function generateRefreshToken(
  payload: JwtUserPayload
): string {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn,
  } as SignOptions);
}

export function verifyAccessToken(
  token: string
): JwtUserPayload {
  return jwt.verify(
    token,
    env.jwtAccessSecret
  ) as JwtUserPayload;
}

export function verifyRefreshToken(
  token: string
): JwtUserPayload {
  return jwt.verify(
    token,
    env.jwtRefreshSecret
  ) as JwtUserPayload;
}