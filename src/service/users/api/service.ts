import { Request, Response } from 'express';
import { database } from '../../../database';
import { getAutoSuggestUsers } from '../controller/helpers';
import { User } from '../../../Models/User';

export const deleteUser = (req: Request, res: Response): void => {
  const id = req.query.id as string;
  const desiredUser = database.users.findBy('id', id);
  if (desiredUser === undefined) {
    res.status(410);
  } else {
    desiredUser.delete();
    res.status(204);
  }
  res.send();
};

export const getUsers = (req: Request, res: Response): void => {
  const { limit, loginSubstring } = req.query;
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

interface UpdateUserRequest extends Request {
  body: {
    id: string;
    login?: string;
    age?: number;
    password?: string;
  };
}

export const updateUser = (req: UpdateUserRequest, res: Response): void => {
  const { age, login, password, id } = req.body;
  let desiredUser: User;
  try {
    desiredUser = database.users.findBy('id', id);
    desiredUser = desiredUser.update({ age, login, password });
    res.status(200).json({ user: desiredUser.toApi() });
  } catch (e) {
    res.status(400).json({ error: e });
  }
};

interface CreateUserRequest extends Request {
  body: {
    login: string;
    age: number;
    password: string;
  };
}

export const createUser = (req: CreateUserRequest, res: Response): void => {
  const { age, login, password } = req.body;
  if (database.users.checkLoginDuplicate(login)) {
    res.status(400).json({ error: 'User with this login already exist' });
    return;
  }
  const newUser = database.users.addUser({ age, login, password });
  res.json({ user: newUser.toApi() });
};
