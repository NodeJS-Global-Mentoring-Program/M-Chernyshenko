import { Request, Response, NextFunction } from 'express';
import { logger } from '../../middlewares/logger';

type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

export const handleMiddlewares = (middlewares: Middleware[]): Middleware[] => {
  const resFunctions: Middleware[] = middlewares.map((middleware) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await middleware(req, res, next);
        return;
        // return next();
      } catch (e) {
        logger.log(e);
        res.status(500).json({ error: e });
        return next('error');
      }
    };
  });
  return resFunctions;
};
