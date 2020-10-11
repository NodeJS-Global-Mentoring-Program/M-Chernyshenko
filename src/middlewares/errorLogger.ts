import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../service/utils/ApiError';
import { ApiResponse } from '../service/utils/ApiResponse';
import { LoggerFactory } from './logger';

const routerLogger = LoggerFactory.getLogger('router');

const logError = (err: Error, req: Request): void => {
  routerLogger.error(
    `Error: HTTP ${req.method} ${req.url} ${req.body}, ${req.query}, ${req.params}, ${err.message}`
  );
};

const sendError = (err: Error, res: Response): void => {
  if (err instanceof ApiError) {
    res
      .status(err.code)
      .json(new ApiResponse({ errors: [err.message], status: err.code }));
    return;
  }
  const response = new ApiResponse({ errors: [err.message], status: 500 });
  res.status(500).json(response);
  return;
};

export const errorLogger = (
  err: Error | Error[],
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err) {
    if (Array.isArray(err)) {
      const errors = err.map((error) => {
        logError(error, req);
        if (error instanceof ApiError) {
          return error;
        }
        return new ApiError({ code: 500, message: error.message });
      });
      res.status(400).json(new ApiResponse({ errors }));
    } else {
      logError(err, req);
      if (err instanceof ApiError) {
        res
          .status(err.code)
          .json(new ApiResponse({ errors: [err.message], status: err.code }));
        return;
      }
      const response = new ApiResponse({ errors: [err.message], status: 500 });
      res.status(500).json(response);
      return;
    }
  }
  next('route');
};
