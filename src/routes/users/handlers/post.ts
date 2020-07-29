import { Request, Response } from 'express';
import Ajv from 'ajv';
import { formatErrors } from '../../helpers';
import { database } from '../../../database';

interface CreateUserRequest extends Request {
  body: {
    login: string;
    age: number;
    password: string;
  };
}

const ajv = new Ajv();
const validationSchema = {
  type: 'object',
  required: ['age', 'login', 'password'],
  properties: {
    age: {
      type: 'integer',
      minimum: 4,
      maximum: 130,
    },
    login: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      pattern: '[\\d]+[\\w]+',
    },
  },
};
const validate = ajv.compile(validationSchema);

const createUser = (req: CreateUserRequest, res: Response): void => {
  const { age, login, password } = req.body;
  const validationResult = validate({ age, login, password });
  if (validationResult === false) {
    res.status(400).json(formatErrors(validate.errors));
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
