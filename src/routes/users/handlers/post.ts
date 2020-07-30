import { Request, Response } from 'express';
import { formatErrors } from '../../helpers';
import { database } from '../../../database';
import { ajv } from '../../../utils/ajv';
import { ajvUserSchema } from './utils';

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
const validate = ajv.compile(validationSchema);

const createUser = (req: CreateUserRequest, res: Response): void => {
  const { age, login, password } = req.body;
  const validationResult = validate({ age, login, password });
  if (validationResult === false) {
    const errors = formatErrors(validate.errors);
    res.status(400).json({ errors });
    return;
  }
  if (database.users.checkLoginDuplicate(login)) {
    res.status(400).json({ error: 'User with this login already exist' });
    return;
  }
  const newUser = database.users.addUser({ age, login, password });
  res.json({ user: newUser.toApi() });
};

export { createUser };
