import express from 'express';

import { applySeeds, applyMigrations } from './sequelize/utils';
import { applyMiddlewares } from './middlewares/applyMiddlewares';
import { initModels } from './config/database/initModels';

const port = process.env.PORT || 3000;

export const bootstrap = async (): Promise<void> => {
  const app = express();
  applyMiddlewares(app);
  initModels();
  // await applyMigrations();
  await applySeeds();
  app.listen(port, () => {
    console.log(`Server listen on http://localhost:${port}`);
  });
};
