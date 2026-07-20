import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";

import routes from "./routes";
import { logger } from "./config/logger";
import { globalErrorHandler } from "@/common";
import { env } from "./config";

const app = express();

app.use(pinoHttp({ logger,
   autoLogging: true,

    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url,
        };
      },

      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },

    customSuccessMessage(req, res) {
      return `${req.method} ${req.url} ${res.statusCode}`;
    },

    customErrorMessage(req, res) {
      return `${req.method} ${req.url} ${res.statusCode}`;
    },
}));


app.use(helmet());

app.use(cors({
  origin: env.clientUrl,
  credentials: true
}));

app.use(compression({
    level: 6,          
    threshold: "1kb", 
    filter: (req, res) =>{
  if (req.path.startsWith("/events")) {
    return false;
  }
  return compression.filter(req, res);
}
  }));

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.use("/api/v1", routes);
app.use(globalErrorHandler);



export default app;