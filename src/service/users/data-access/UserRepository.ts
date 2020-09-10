import { Op } from 'sequelize';

import { SequelizeUserModel } from './SequelizeUserModel';
import { UserDto } from '../types';
import { validate } from 'uuid';
import { IBaseMapper } from '../../types';

class UserRepository {
  private userMapper: IBaseMapper<UserDto, SequelizeUserModel>;
  private UserModel: typeof SequelizeUserModel;

  constructor(
    userModel: typeof SequelizeUserModel,
    userMapper: IBaseMapper<UserDto, SequelizeUserModel>
  ) {
    this.userMapper = userMapper;
    this.UserModel = userModel;
  }

  public async create(user: Required<UserDto>): Promise<UserDto> {
    const createdUser = await this.UserModel.create(user);
    return this.userMapper.toDto(createdUser);
  }

  public async findBy<K extends keyof UserDto>(
    key: K,
    value: ValueOf<UserDto>,
    isDeleted = false
  ): Promise<UserDto[]> {
    if (key === 'user_id') {
      this.validateId(value);
    }

    const desiredUsers = await this.UserModel.findAll({
      where: {
        [key]: value,
        isDeleted,
      },
    });
    return desiredUsers.map((user) => this.userMapper.toDto(user));
  }

  public async update(
    id: string,
    userData: Partial<UserDto>
  ): Promise<UserDto> {
    const desiredUser = await this.UserModel.findOne({
      where: { user_id: id },
    });
    if (desiredUser === null) {
      throw new Error(`user with id: ${id} not found`);
    }
    const { age, login, password } = userData;
    if (age !== undefined) {
      desiredUser.age = age;
    }
    if (login !== undefined) {
      desiredUser.login = login;
    }
    if (password !== undefined) {
      desiredUser.password = password;
    }
    const savedUser = await desiredUser.save();
    return this.userMapper.toDto(savedUser);
  }

  public async findById(
    id: string,
    isDeleted = false
  ): Promise<UserDto | null> {
    const desiredUser = await this.UserModel.findOne({
      where: {
        user_id: id,
        isDeleted,
      },
    });

    if (desiredUser === null) {
      return null;
    }

    return this.userMapper.toDto(desiredUser);
  }

  public async delete(id: string): Promise<string> {
    this.validateId(id);
    const desiredUser = await this.UserModel.findOne({
      where: { user_id: id },
    });
    if (desiredUser === null || desiredUser.isDeleted === true) {
      throw new Error('User not found');
    }
    await desiredUser.update({ isDeleted: true });

    return desiredUser.user_id;
  }

  public async getAutoSuggestUsers(
    limit = 10,
    substring: string | undefined,
    findDeleted = false
  ): Promise<UserDto[]> {
    if (limit <= 0) {
      return [];
    }

    const users = await this.UserModel.findAll({
      order: [['login', 'ASC']],
      where: {
        isDeleted: findDeleted,
        ...(typeof substring === 'string' && {
          login: { [Op.like]: `%${substring}%` },
        }),
      },
      limit,
    });

    return users.map((user) => this.userMapper.toDto(user));
  }

  private validateId(id: ValueOf<UserDto>): void {
    if (typeof id !== 'string' || !validate(id)) {
      throw new Error(`id ${id} not valid`);
    }
  }
}

export { UserRepository };
