import { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";

import {
  AppError,
  HTTP_STATUS,
  RESPONSE_MESSAGE,
} from "@/common";

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: RESPONSE_MESSAGE.VALIDATION_FAILED,
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: RESPONSE_MESSAGE.VALIDATION_FAILED,
      errors: Object.values(error.errors).map((err) => err.message),
    });
  }

  if (
    error instanceof mongoose.Error.CastError
  ) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "Invalid resource id.",
    });
  }

  // Duplicate key (E11000)
  if (
    error instanceof mongoose.mongo.MongoServerError &&
    error.code === 11000
  ) {
    const field = Object.keys(error.keyPattern)[0];

    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      message: `${field} already exists.`,
    });
  }

  console.error(error);

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
  });
};