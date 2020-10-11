import { UserDto } from '../../types';

const users: UserDto[] = [
  {
    age: 18,
    login: 'login',
    uuid: '8e3f174f-e5a4-4f47-b5ff-71c19d7c0825',
  },
];

interface FindParams {
  where: Partial<Record<keyof UserDto, string>>;
}

export const UserModel = {
  async create(user: UserDto): Promise<UserDto> {
    if (users.some((existUser) => existUser.login === user.login)) {
      throw new Error('User already exist');
    }

    return user;
  },

  async findOne(params: FindParams): Promise<UserDto | null> {
    const desiredUser = users.find((user) => {
      const whereKeys = Object.keys(params.where) as (keyof UserDto)[];
      const isUserHaveKey = whereKeys.every((key) => {
        return (
          Object.keys(user).includes(key) && user[key] === params.where[key]
        );
      });
      return isUserHaveKey;
    });

    return desiredUser ?? null;
  },
};
