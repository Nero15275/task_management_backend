import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants/http-status.constant';
import { RESPONSE_MESSAGE } from '../constants/response-message.constant';
import { AppError } from './app.error';

export const jsonSyntaxErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // If it's a JSON parsing syntax error, normalize it before throwing it forward
  let nextError
  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    nextError = new AppError(
            RESPONSE_MESSAGE.MALFORMED_JSON,
            HTTP_STATUS.BAD_REQUEST
          )
   
  }
  
  // Hand it off to your global error handler
  next(nextError || err);
};