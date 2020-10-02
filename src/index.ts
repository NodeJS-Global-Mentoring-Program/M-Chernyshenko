import { config } from 'dotenv';

import { App } from './App';
import { LoggerFactory } from './middlewares/logger';

config();
new App()
  .init()
  .then((app) => {
    app.listen();
  })
  .catch((error) => {
    LoggerFactory.getLogger('app').error(error);
  });
