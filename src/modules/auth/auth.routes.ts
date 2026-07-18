import { Router } from "express";

import * as AuthController from "./auth.controller";
import { validate } from "@/common";

import { loginSchema } from "./dto/login.dto";
import { registerSchema } from "./dto/register.dto";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  AuthController.register
);

router.post(
  "/login",
  validate(loginSchema),
  AuthController.login
);

router.post(
  "/refresh",
  AuthController.refresh
);

router.get(
  "/logout",
  AuthController.logout
);

export default router;