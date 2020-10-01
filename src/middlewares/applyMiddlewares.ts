import express, { Application } from 'express';
import { groupsRouter } from '../service/Groups';
import { userRouter } from '../service/Users';
import { errorLogger } from './errorLogger';
import { LoggerFactory } from './logger';

export const applyMiddlewares = (app: Application): void => {
  app.use(LoggerFactory.getLogger('router').getExpressLogger());
  app.use(express.json());
  app.use('/users/', userRouter);
  app.use('/groups', groupsRouter);

  app.use('*', errorLogger);
  app.use((req, res, next) => {
    res.send('Route not found');
  });
};
