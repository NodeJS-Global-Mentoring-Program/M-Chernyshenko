import { Request, Response, NextFunction } from 'express';
import { UserRepository, SequelizeUserModel, UserMapper } from '../data-access';
import { User } from '../User';

const userRepository = new UserRepository(SequelizeUserModel, new UserMapper());

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.query.id as string;
  try {
    await userRepository.delete(id);
    res.status(204);
  } catch {
    res.status(410);
  }
  res.send();
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { limit, loginSubstring, findDeleted } = req.query;
  const _limit =
    typeof limit === 'string' && !Number.isNaN(parseInt(limit, 10))
      ? parseInt(limit, 10)
      : undefined;
  const _loginSubstring =
    typeof loginSubstring === 'string' ? loginSubstring : undefined;
  const _findDeleted = typeof findDeleted === 'string' && findDeleted === '1';
  const suggestedUsers = await userRepository.getAutoSuggestUsers(
    _limit,
    _loginSubstring,
    _findDeleted
  );
  res.json({
    users: suggestedUsers,
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

export const updateUser = async (
  req: UpdateUserRequest,
  res: Response
): Promise<void> => {
  const { age, login, password, id } = req.body;
  try {
    const desiredUser = await userRepository.update(id, {
      age,
      login,
      password,
    });
    res.status(200).json({ user: desiredUser });
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

export const createUser = async (
  req: CreateUserRequest,
  res: Response
): Promise<void> => {
  const { age, login, password } = req.body;
  const user = new User({ login, password, age });
  const newUser = await userRepository.create(user.toEntity());
  res.json({ user: newUser });
};
