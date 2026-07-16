import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";

import routes from "./routes";
import { logger } from "./config/logger";
import { globalErrorHandler } from "@/common";

const app = express();

app.use(pinoHttp({ logger }));

app.use(helmet());

app.use(cors({
  origin: true,
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