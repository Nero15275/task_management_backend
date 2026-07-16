import http from "http";

import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/database";
import { logger } from "./config/logger";

async function bootstrap() {
  await connectDB();

  const server = http.createServer(app);

  server.listen(env.port, () => {
    logger.info(`Server running on port ${env.port}`);
  
  });
}

bootstrap();