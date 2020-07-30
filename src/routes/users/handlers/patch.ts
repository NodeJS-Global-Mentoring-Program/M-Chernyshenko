import { Request, Response } from 'express';
import { database } from '../../../database';
import { User } from '../../../Models/User';
import { ajvUserSchema, ajvValidateId } from './utils';
import { ajv } from '../../../utils/ajv';
import { formatErrors } from '../../helpers';

interface UpdateUserRequest extends Request {
  body: {
    id: string;
    login?: string;
    age?: number;
    password?: string;
  };
}

const schema = {
  type: 'object',
  required: ['id'],
  properties: {
    ...ajvUserSchema,
    id: ajvValidateId,
  },
};

const ajvValidate = ajv.compile(schema);

const updateUser = (req: UpdateUserRequest, res: Response): void => {
  const { age, login, password, id } = req.body;
  const isValid = ajvValidate({ id, login, age, password });
  if (isValid === false) {
    const errors = formatErrors(ajvValidate.errors);
    res.status(400).json({ errors });
    return;
  }
  let desiredUser: User;
  try {
    desiredUser = database.users.findBy('id', id);
    desiredUser = desiredUser.update({ age, login, password });
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
  res.status(200).json({ user: desiredUser.toApi() });
};

export { updateUser };
