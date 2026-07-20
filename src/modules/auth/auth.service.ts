import { AppError, HTTP_STATUS, RESPONSE_MESSAGE, UserRole } from "@/common";
import { RegisterDto } from "./dto/register.dto";

import * as UserRepository from "@/modules/user/user.repository";
import { LoginDto } from "./dto/login.dto";
import * as JwtService from "./jwt/jwt.service";
import * as PasswordService from "./password.service";
import * as TokenService from "./jwt/token.service";
import * as RefreshTokenRepository from "./refreshToken/refresh-token.repository";
import { env, logger } from "@/config";
import { JwtUserPayload } from "./jwt/jwt.service";




export async function register(payload: RegisterDto) {
  if (payload.role === UserRole.SUPER_ADMIN) {
    throw new AppError(
      RESPONSE_MESSAGE.INVALID_ROLE,
      HTTP_STATUS.FORBIDDEN
    );
  }

  if (await UserRepository.emailExists(payload.email)) {
    throw new AppError(
      RESPONSE_MESSAGE.EMAIL_ALREADY_EXISTS,
      HTTP_STATUS.CONFLICT
    );
  }

  if (await UserRepository.usernameExists(payload.username)) {
    throw new AppError(
      RESPONSE_MESSAGE.USERNAME_ALREADY_EXISTS,
      HTTP_STATUS.CONFLICT
    );
  }

  await validateReportingHierarchy(payload);

  const hashedPassword = await PasswordService.hashPassword(payload.password);

  const user = await UserRepository.create({
    ...payload,
    password: hashedPassword,
  });

  const { password, ...safeUser } = user.toObject();

  return safeUser;
}


export async function login(payload: LoginDto) {
  const user = await UserRepository.findByEmail(payload.email);
  logger.info(`User found: ${user?.email}, Active: ${user?.isActive}`);
  console.log("in login",user)
   if (!user) {
    throw new AppError(
      RESPONSE_MESSAGE.INVALID_CREDENTIALS,
      HTTP_STATUS.UNAUTHORIZED
    );
  }
  
  if (!user?.isActive) {
  throw new AppError(
    RESPONSE_MESSAGE.USER_DISABLED,
    HTTP_STATUS.FORBIDDEN
  );
}
 

  const isPasswordValid = await PasswordService.comparePassword(
    payload.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new AppError(
      RESPONSE_MESSAGE.INVALID_CREDENTIALS,
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  const jwtPayload:JwtUserPayload = {
    sub: user.id,
    role: user.role,
  };

  const accessToken = JwtService.generateAccessToken(jwtPayload);

  const refreshToken = JwtService.generateRefreshToken(jwtPayload);

  // Optional: keep only one active session per user
  await RefreshTokenRepository.deleteByUserId(user._id);

  await RefreshTokenRepository.create({
    userId: user._id,
    tokenHash: TokenService.hashToken(refreshToken),
    expiresAt: TokenService.getExpiryDate(
      env.jwtRefreshExpiresIn
    ),
  });

  const { password, ...safeUser } = user.toObject();

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
}



export async function refresh(refreshToken: string) {
  // Verify JWT (throws if invalid or expired)
  const payload = JwtService.verifyRefreshToken(refreshToken);

  // Hash incoming token
  const tokenHash = TokenService.hashToken(refreshToken);

  // Verify token exists in database
  const storedToken = await RefreshTokenRepository.findByTokenHash(
    tokenHash
  );

  if (!storedToken) {
    throw new AppError(
      RESPONSE_MESSAGE.INVALID_REFRESH_TOKEN,
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  // Verify user still exists
  const user = await UserRepository.findById(payload.sub);

  if (!user) {
    throw new AppError(
      RESPONSE_MESSAGE.USER_NOT_FOUND,
      HTTP_STATUS.NOT_FOUND
    );
  }

  const accessToken = JwtService.generateAccessToken({
    sub: user.id,
    role: user.role,
  });

  return {
    accessToken,
  };
}


export async function logout(refreshToken: string) {
  const tokenHash = TokenService.hashToken(refreshToken);

  await RefreshTokenRepository.deleteByTokenHash(tokenHash);
}

async function validateReportingHierarchy(payload: RegisterDto) {
  if (!payload.reportsTo) return;

  const reportingUser = await UserRepository.findById(payload.reportsTo);

  if (!reportingUser) {
    throw new AppError(
      RESPONSE_MESSAGE.USER_NOT_FOUND,
      HTTP_STATUS.NOT_FOUND
    );
  }

  switch (payload.role) {
    case UserRole.TEAM_LEAD:
      if (reportingUser.role !== UserRole.MANAGER) {
        throw new AppError(
          "Team Lead must report to a Manager",
          HTTP_STATUS.BAD_REQUEST
        );
      }
      break;

    case UserRole.EMPLOYEE:
      if (reportingUser.role !== UserRole.TEAM_LEAD) {
        throw new AppError(
          "Employee must report to a Team Lead",
          HTTP_STATUS.BAD_REQUEST
        );
      }
      break;
  }
}
