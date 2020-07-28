import { Router, Request, Response } from 'express';
import { validate } from 'uuid';
import { getAutoSuggestUsers } from './helpers';
import { users } from '../database';
import { User } from '../Models/User';

const router = Router();

interface GetUsers extends Request {
  query: {
    limit: string;
    loginSubstring: string;
    [key: string]: any;
  };
}

interface CreateUserRequest extends Request {
  body: {
    login: string;
    age: number;
    password: string;
  };
}

interface UpdateUserRequest extends Request {
  body: {
    id: string;
    login?: string;
    age?: number;
    password?: string;
  };
}

const getUsers = (req: Request, res: Response): void => {
  const { limit, loginSubstring } = req.query;
  if (
    limit !== undefined &&
    (typeof limit !== 'string' || isNaN(parseInt(limit, 10)))
  ) {
    res.status(400).json({ error: "'limit' have wrong format" });
    return;
  }
  const suggestedUsers = getAutoSuggestUsers(
    typeof limit === 'string' && !isNaN(parseInt(limit, 10))
      ? parseInt(limit, 10)
      : undefined,
    typeof loginSubstring === 'string'
      ? loginSubstring.toLowerCase()
      : undefined
  );
  const usersForApi = suggestedUsers.map((user) => user.toApi());
  res.json({
    users: usersForApi,
  });
};
const createUser = (req: CreateUserRequest, res: Response): void => {
  const { age, login, password } = req.body;
  if (users.some((user) => user.login === login)) {
    res.status(400).json({ error: 'User with this login already exist' });
    return;
  }
  const newUser = new User(login.trim(), password.trim(), age);
  users.push(newUser);
  res.json({ user: newUser.toApi() });
};

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

const deleteUser = (req: Request, res: Response): void => {
  const { id } = req.query;
  if (typeof id !== 'string') {
    res.status(400).json({ error: 'user id was not provided' });
    return;
  }
  const desiredUser = users
    .filter((user) => !user.isDeleted && validate(id))
    .find((user) => user.id === id);
  if (desiredUser === undefined) {
    res.status(410);
  } else {
    desiredUser.delete();
    res.status(204);
  }
  res.send();
};
router
  .route('/')
  .get(getUsers)
  .post(createUser)
  .patch(updateUser)
  .delete(deleteUser);

export { router as userRouter };
