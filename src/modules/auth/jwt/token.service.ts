import { logger } from "@/config/logger";
import crypto from "crypto";
import ms from "ms";

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function getExpiryDate(expiresIn: string): Date {
  const duration = ms(expiresIn as ms.StringValue  );
  logger.info(`Parsed duration for expiresIn "${expiresIn}": ${duration} ms`);

  if (typeof duration !== "number") {
    throw new Error(`Invalid expiresIn value: ${expiresIn}`);
  }

  return new Date(Date.now() + Number(duration));
}