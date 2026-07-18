
import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

/**
 * Recursively traverses an object/array to sanitize all string values.
 */
const deepSanitize = (input: any): any => {
  if (typeof input === 'string') {
    // Strip ALL HTML tags and trim whitespace
    return sanitizeHtml(input, {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();
  }

  if (Array.isArray(input)) {
    return input.map(deepSanitize);
  }

  if (typeof input === 'object' && input !== null) {
    const cleanObj: Record<string, any> = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        cleanObj[key] = deepSanitize(input[key]);
      }
    }
    return cleanObj;
  }

  // Return numbers, booleans, null, etc., as they are
  return input;
};

/**
 * Global middleware to sanitize req.body, req.query, and req.params
 */
export const globalSanitizer = (req: Request, res: Response, next: NextFunction): void => {
  if (req.body) req.body = deepSanitize(req.body);
  if (req.query) req.query = deepSanitize(req.query);
  if (req.params) req.params = deepSanitize(req.params);

  next();
};