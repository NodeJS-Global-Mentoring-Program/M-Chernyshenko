import express, { Application } from 'express';
import cors from 'cors';

import { authRouter } from '../service/Auth/controller/auth';
import { groupsRouter } from '../service/Groups';
import { userRouter } from '../service/Users';
import { ApiError } from '../service/utils/ApiError';

import { errorLogger } from './errorLogger';

import { LoggerFactory } from './logger';

export const applyMiddlewares = (app: Application): void => {
  app.use(LoggerFactory.getLogger('router').getExpressLogger());
  app.use(express.json());
  app.use(cors());

  app.use('', authRouter);
  app.use('/users', userRouter);
  app.use('/groups', groupsRouter);

  app.use((req, res, next) => {
    return next(new ApiError({ code: 400, message: 'Route not found' }));
  });
  app.use('*', errorLogger);
};
