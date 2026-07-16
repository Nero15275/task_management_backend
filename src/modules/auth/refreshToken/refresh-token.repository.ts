import { Types } from "mongoose";

import {
  IRefreshToken,
  RefreshTokenDocument,
  RefreshTokenModel,
} from "./refresh-token.model";

export async function create(
  payload: IRefreshToken
): Promise<RefreshTokenDocument> {
  return RefreshTokenModel.create(payload);
}

export async function findByTokenHash(
  tokenHash: string
): Promise<RefreshTokenDocument | null> {
  return RefreshTokenModel.findOne({ tokenHash }).exec();
}

export async function deleteByTokenHash(
  tokenHash: string
): Promise<void> {
  await RefreshTokenModel.deleteOne({ tokenHash });
}

export async function deleteByUserId(
  userId: Types.ObjectId | string
): Promise<void> {
  await RefreshTokenModel.deleteMany({ userId });
}