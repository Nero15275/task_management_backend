import fs from "node:fs";
import path from "node:path";
import pino from "pino";
import {env} from "./env";

const logDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const today = new Date().toISOString().split("T")[0];

const accessStream = pino.destination({
  dest: path.join(logDir, `access-${today}.log`),
  sync: false,
});

const errorStream = pino.destination({
  dest: path.join(logDir, `error-${today}.log`),
  sync: false,
});

const consoleTransport =
  env.nodeEnv === "development"
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss",
          ignore: "pid,hostname",
        },
      }
    : undefined;

export const logger = pino(
  {
    level: "trace"                                        //env.nodeEnv === "production" ? "info" : "debug",
  },
  pino.multistream([
    ...(consoleTransport
      ? [{ stream: pino.transport(consoleTransport) }]
      : []),
    { stream: accessStream },
    { level: "error", stream: errorStream },
  ])
);