import { NextFunction, Request, Response } from "express";

import { AppError, HTTP_STATUS, RESPONSE_MESSAGE } from "@/common";
import * as JwtService from "@/modules/auth/jwt/jwt.service";

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(
      new AppError(
        RESPONSE_MESSAGE.UNAUTHORIZED,
        HTTP_STATUS.UNAUTHORIZED
      )
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = JwtService.verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  } catch {
    next(
      new AppError(
        RESPONSE_MESSAGE.INVALID_ACCESS_TOKEN,
        HTTP_STATUS.UNAUTHORIZED
      )
    );
  }
}