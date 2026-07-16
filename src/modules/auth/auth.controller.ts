import { Request, Response, NextFunction } from "express";
import ms from "ms";

import { env } from "@/config/env";
import { HTTP_STATUS, RESPONSE_MESSAGE } from "@/common";

import * as AuthService from "./auth.service";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await AuthService.register(req.body);

    res.status(HTTP_STATUS.CREATED).json({
      message: RESPONSE_MESSAGE.USER_CREATED,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await AuthService.login(req.body);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "strict",
     
    });

    res.status(HTTP_STATUS.OK).json({
      message: RESPONSE_MESSAGE.LOGIN_SUCCESS,
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: RESPONSE_MESSAGE.INVALID_REFRESH_TOKEN,
    });
    }

    const result = await AuthService.refresh(refreshToken);

    res.status(HTTP_STATUS.OK).json({
      message: RESPONSE_MESSAGE.TOKEN_REFRESHED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken = req.cookies.refreshToken;

    await AuthService.logout(refreshToken);

    res.clearCookie("refreshToken");

    res.status(HTTP_STATUS.OK).json({
      message: RESPONSE_MESSAGE.LOGOUT_SUCCESS,
    });
  } catch (error) {
    next(error);
  }
}