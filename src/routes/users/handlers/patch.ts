import { Request, Response } from 'express';
import { database } from '../../../database';
import { User } from '../../../Models/User';

interface UpdateUserRequest extends Request {
  body: {
    id: string;
    login?: string;
    age?: number;
    password?: string;
  };
}

const updateUser = (req: UpdateUserRequest, res: Response): void => {
  const { age, login, password, id } = req.body;
  let desiredUser: User;
  try {
    desiredUser = database.users.findBy('id', id);
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
  if (typeof age === 'number') {
    desiredUser.age = age;
  }
  if (typeof login === 'string') {
    desiredUser.login = login;
  }
  if (typeof password === 'string') {
    desiredUser.password = password;
  }
  res.status(200).json({ user: desiredUser.toApi() });
};

export { updateUser };
