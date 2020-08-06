import { Request, Response } from 'express';
import { database } from '../../../database';
import { User } from '../../../Models/User';
import { ajvUserSchema, ajvValidateId } from './utils';
import { createRequestValidator } from '../../helpers';

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

export const updateUserValidation = createRequestValidator(schema);

export const updateUser = (req: UpdateUserRequest, res: Response): void => {
  const { age, login, password, id } = req.body;
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
