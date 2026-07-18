import http from "http";

import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/database";
import { logger } from "./config/logger";
import { bootstrapSuperAdmin } from "./bootstrap";

async function bootstrap() {
  await connectDB();
  
   await bootstrapSuperAdmin();
   
  const server = http.createServer(app);

  server.listen(env.port, () => {
    logger.info(`Server running on port ${env.port}`);
  
  });
}

bootstrap();