import express from 'express';
import winston from 'winston';
import expressWinston from 'express-winston';
import { userRouter } from './routes';

const port = process.env.PORT || 3000;

const app = express();
const jsonParser = express.json();
const logger = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(winston.format.json()),
  meta: false,
  expressFormat: true,
});

app.use(logger);
app.use(jsonParser);
app.use('/users/', userRouter);

app.listen(port, () => {
  console.log(`Server listen on http://localhost:${port}`);
});
