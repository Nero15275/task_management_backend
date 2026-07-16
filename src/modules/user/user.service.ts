import { AppError, HTTP_STATUS, RESPONSE_MESSAGE } from "@/common";
import { logger } from "@/config/logger";
import { CreateUserDto } from "@/modules/user/dto/createUser.dto";
import { UpdateUserDto } from "@/modules/user/dto/updateUser.dto";
import * as UserRepository from "@/modules/user/user.repository";

export async function createUser(payload: CreateUserDto) {
  const emailExists = await UserRepository.findByEmail(payload.email);

  if (emailExists) {
    throw new AppError(
      RESPONSE_MESSAGE.EMAIL_ALREADY_EXISTS,
      HTTP_STATUS.CONFLICT
    );
  }

  const usernameExists = await UserRepository.findByUsername(
    payload.username
  );

  if (usernameExists) {
    throw new AppError(
      RESPONSE_MESSAGE.USERNAME_ALREADY_EXISTS,
      HTTP_STATUS.CONFLICT
    );
  }

  return UserRepository.create(payload);
}

export async function getUserById(id: string) {
  const user = await UserRepository.findById(id);

  if (!user) {
    throw new AppError(
      RESPONSE_MESSAGE.USER_NOT_FOUND,
      HTTP_STATUS.NOT_FOUND
    );
  }

  return user;
}

export async function getAllUsers() {
  return UserRepository.findAll();
}

export async function updateUser(
  id: string,
  payload: UpdateUserDto
) {
  const user = await UserRepository.findById(id);

  if (!user) {
    throw new AppError(
      RESPONSE_MESSAGE.USER_NOT_FOUND,
      HTTP_STATUS.NOT_FOUND
    );
  }

  return UserRepository.updateById(id, payload);
}

export async function deleteUser(id: string) {
  const user = await UserRepository.findById(id);

  if (!user) {
    throw new AppError(
      RESPONSE_MESSAGE.USER_NOT_FOUND,
      HTTP_STATUS.NOT_FOUND
    );
  }

  await UserRepository.deleteById(id);
}

export async function getReportingUsers(userId: string) {
  console.log(`Reporting users for user ID ${userId}`);
  const users = await UserRepository.findByReportsTo(userId);
  
  console.log(`Reporting users for user ID ${userId}: ${users.map((u:any) => u.id).join(", ")}`);
  if (!users.length) {
    throw new AppError(
      RESPONSE_MESSAGE.USER_NOT_FOUND,
      HTTP_STATUS.NOT_FOUND
    );
  }

  return users;
}