import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "./logger";

export async function connectDB() {
  try {
    await mongoose.connect(env.mongoUri);

    logger.info("MongoDB connected");
  } catch (error) {
    logger.error(error);

    process.exit(1);
  }
}