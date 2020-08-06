import { Request, Response } from 'express';
import { database } from '../../../database';
import { ajvUserSchema } from './utils';
import { createRequestValidator } from '../../helpers';

interface CreateUserRequest extends Request {
  body: {
    login: string;
    age: number;
    password: string;
  };
}

const validationSchema = {
  type: 'object',
  required: ['age', 'login', 'password'],
  properties: ajvUserSchema,
};

export const createUserValidation = createRequestValidator(validationSchema);

export const createUser = (req: CreateUserRequest, res: Response): void => {
  const { age, login, password } = req.body;
  if (database.users.checkLoginDuplicate(login)) {
    res.status(400).json({ error: 'User with this login already exist' });
    return;
  }
  const newUser = database.users.addUser({ age, login, password });
  res.json({ user: newUser.toApi() });
};
