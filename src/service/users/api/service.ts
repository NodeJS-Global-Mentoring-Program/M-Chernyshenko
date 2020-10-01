import { Request, Response, NextFunction } from 'express';
import { ApiMiddleware } from '../../types';
import { ApiResponse } from '../../utils/ApiResponse';
import { UserRepository, UserModel, UserMapper } from '../data-access';
import { UserDto } from '../types';
import { User } from '../User';

const userRepository = new UserRepository(UserModel);
const userMapper = new UserMapper();

export const getUser: ApiMiddleware<any, any, { id: string }> = async (
  req,
  res,
  next
) => {
  const { id } = req.params;
  const user = await userRepository.findById(id);
  if (user === null) {
    res
      .status(400)
      .json(new ApiResponse({ errors: [new Error('user not found')] }));
    return;
  }
  res.json(
    new ApiResponse({
      data: {
        user: userMapper.toDto(user),
      },
    })
  );
};

export const deleteUser: ApiMiddleware<any, any, { id: string }> = async (
  req,
  res
) => {
  const { id } = req.params;
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
  const { result } = new ApiResponse({
    data: { users: suggestedUsers.map((user) => userMapper.toDto(user)) },
  });
  res.json(result);
};

type UpdateUserRequest = { id: string } & Partial<
  Pick<UserDto, 'login' | 'age' | 'groups' | 'password'>
>;

export const updateUser: ApiMiddleware<UpdateUserRequest> = async (
  req,
  res
) => {
  const { age, login, password, id, groups } = req.body;
  try {
    const desiredUser = await userRepository.update(id, {
      age,
      login,
      password,
      groups,
    });
    res
      .status(200)
      .json(
        new ApiResponse({ data: { user: userMapper.toDto(desiredUser) } })
          .result
      );
  } catch (e) {
    console.log(e);
    res.status(400).json(new ApiResponse({ errors: [e] }).result);
  }
};

interface CreateUserBody {
  login: string;
  age: number;
  password: string;
  groups?: string[];
}

export const createUser: ApiMiddleware<CreateUserBody> = async (req, res) => {
  const { age, login, password, groups } = req.body;
  const user = new User({ login, password, age, groups });
  const newUser = await userRepository.create(user.toJson());
  res.json(new ApiResponse({ data: { user: userMapper.toDto(newUser) } }));
};
