import { UserDto } from '../../types';

const users: UserDto[] = [
  {
    uuid: 'f4faa5ad-f654-46f4-91f0-c08b73cd691d',
    age: 28,
    login: 'login1',
    isDeleted: false,
  },
  {
    login: 'login',
    age: 23,
    isDeleted: false,
    uuid: '8e3f174f-e5a4-4f47-b5ff-71c19d7c0825',
  },
  {
    login: 'login2',
    age: 23,
    isDeleted: true,
    uuid: 'f2699514-c236-4a2b-b0ba-004a0830fed8',
  },
];

export class UserRepository {
  constructor() {}

  public async findById(id: string): Promise<any> {
    return users.find((user) => user.uuid === id) ?? null;
  }

  public async create<T extends { login: string }>(user: T): Promise<T> {
    if (user.login === 'login') {
      throw new Error('User already exist');
    }
    return user;
  }

  public async delete(id: string): Promise<string> {
    const user = users.find((existUser) => existUser.uuid === id);
    if (user === null || user === undefined || user.isDeleted === true) {
      throw new Error('User not found');
    }

    return user.uuid;
  }

  public async getAutoSuggestUsers(
    limit = 10,
    substring: string | undefined,
    findDeleted = false
  ): Promise<UserDto[]> {
    if (limit <= 0) {
      return [];
    }

    const result = users
      .filter(
        (user) =>
          user.login.includes(substring ?? '') && user.isDeleted === findDeleted
      )
      .sort((a, b) => (a.login > b.login ? 1 : -1))
      .slice(0, limit);
    return result;
  }
}
