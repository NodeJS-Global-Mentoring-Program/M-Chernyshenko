import express from 'express';
import { userRouter } from './routes';

const port = process.env.PORT || 3000;

const app = express();
const jsonParser = express.json();

app.use(jsonParser);
app.use('/users/', userRouter);

app.listen(port, () => {
  console.log(`Server listen on http://localhost:${port}`);
});
