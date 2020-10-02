import { Controller } from '../../Controller';
import { login } from '../api/auth';
import { loginValidation } from '../validation/auth';

export const authRouter = new Controller()
  .setPath('/login')
  .post([loginValidation, login], { auth: false })
  .getRouter();
