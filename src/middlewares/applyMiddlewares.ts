import express, { Application, Request, Response, NextFunction } from 'express';
import { userRouter } from '../service/Users';
import { logger } from './logger';

export const applyMiddlewares = (app: Application): void => {
  app.use(logger.logger);
  app.use(express.json());
  app.use(
    '*',
    (err: Error, req: Request, res: Response, next: NextFunction) => {
      if (err) {
        console.error(err);
        res.status(500).send(err.message);
        return;
      }
      next('route');
    }
  );
  app.use('/users/', userRouter);

  app.use((req, res, next) => {
    res.send('Route not found');
  });
};
