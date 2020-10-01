import express from 'express';

import { applyMiddlewares } from './middlewares/applyMiddlewares';
import { configureDB } from './sequelize';

export class App {
  private port = process.env.PORT ?? 3000;
  private app;

  constructor() {
    this.app = express();
  }

  public async init(): Promise<this> {
    applyMiddlewares(this.app);
    await configureDB();
    return this;
  }

  public listen(cb?: () => void): void {
    const defaultCb = () => {
      console.log(`Server listen on http://localhost:${this.port}`);
    };
    this.app.listen(this.port, cb ?? defaultCb);
    process.on('uncaughtException', (err) => {
      if (err) {
        console.error('uncaughtException');
        console.error(err.message);
        process.exit(1);
      }
    });
  }
}
