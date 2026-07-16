import crypto from "crypto";
import ms from "ms";

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function getExpiryDate(expiresIn: string): Date {
  const duration = ms(parseInt(expiresIn));

  if (typeof duration !== "number") {
    throw new Error(`Invalid expiresIn value: ${expiresIn}`);
  }

  return new Date(Date.now() + duration);
}