import { Request, Response } from 'express';
import { validate } from 'uuid';
import { users } from '../../../database';

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
  if (typeof id !== 'string' || !validate(id)) {
    res.status(400).json({ error: 'invalid id' });
    return;
  }
  const desiredUser = users.find((user) => !user.isDeleted && user.id === id);
  if (desiredUser === undefined) {
    res.status(400).json({ error: `user with id ${id} not found` });
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
