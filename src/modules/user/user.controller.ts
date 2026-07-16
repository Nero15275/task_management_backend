import { NextFunction, Request, Response } from "express";

import { HTTP_STATUS, RESPONSE_MESSAGE } from "@/common";

import { CreateUserDto } from "@/modules/user/dto/createUser.dto";
import { UpdateUserDto } from "@/modules/user/dto/updateUser.dto";
import * as UserService from "@/modules/user/user.service";

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await UserService.createUser(req.body as CreateUserDto);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: RESPONSE_MESSAGE.USER_CREATED,
      data: user,
    });
  } catch (error) {
    console.log("ranit",error);
    next(error);
  }
}

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await UserService.getUserById(req.params.id as string);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllUsers(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const users = await UserService.getAllUsers();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await UserService.updateUser(
      req.params.id as string,
      req.body as UpdateUserDto
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: RESPONSE_MESSAGE.USER_UPDATED,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await UserService.deleteUser(req.params.id as string);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: RESPONSE_MESSAGE.USER_DELETED,
    });
  } catch (error) {
    next(error);
  }
}