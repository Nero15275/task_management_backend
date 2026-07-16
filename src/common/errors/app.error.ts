import { HTTP_STATUS } from "@/common/constants/http-status.constant";

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    public readonly isOperational = true
  ) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}