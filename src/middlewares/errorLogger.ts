import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../service/utils/ApiError';
import { ApiResponse } from '../service/utils/ApiResponse';
import { LoggerFactory } from './logger';

export const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err) {
    LoggerFactory.getLogger('router').error(
      `Error: HTTP ${req.method} ${req.url} ${req.body}, ${req.query}, ${req.params}, ${err.message}`
    );
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
  next('route');
};
