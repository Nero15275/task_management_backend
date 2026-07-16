import { NextFunction, Request, Response } from "express";

import { AppError, HTTP_STATUS, RESPONSE_MESSAGE, UserRole } from "@/common";

export function authorize(...roles: UserRole[]) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return next(
        new AppError(
          RESPONSE_MESSAGE.UNAUTHORIZED,
          HTTP_STATUS.UNAUTHORIZED
        )
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          RESPONSE_MESSAGE.FORBIDDEN,
          HTTP_STATUS.FORBIDDEN
        )
      );
    }

    next();
  };
}