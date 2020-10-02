import { Op } from 'sequelize';
import crypto from 'crypto';

import { UserModel } from './UserModel';
import { UserDto } from '../types';
import { BaseRepository } from '../../BaseRepository';
import { GroupRepository } from '../../Groups/api/GroupRepository';
import { GroupModel } from '../../Groups/data-access';

const userNotFoundMessage = 'User not found';

type UpdateUserData = Partial<UserDto>;

type CreateUserData = Required<
  Pick<UserDto, 'age' | 'login' | 'password' | 'uuid'>
> &
  Partial<Pick<UserDto, 'groups'>>;

class UserRepository extends BaseRepository<UserModel> {
  private UserModel: typeof UserModel;

  constructor(userModel: typeof UserModel) {
    super();
    this.UserModel = userModel;
  }

  public async create(user: CreateUserData): Promise<UserModel> {
    if (this.isLoginDuplicate(user.login)) {
      this.throwError('User already exist');
    }
    const encryptedPassword = crypto
      .createHmac('sha512', 'someSalt')
      .update(user.password)
      .digest('hex');
    console.log(encryptedPassword);
    const createdUser = await this.UserModel.create({
      ...user,
      password: encryptedPassword,
    });
    return createdUser;
  }

  public async findById(
    id: string,
    isDeleted = false
  ): Promise<UserModel | null> {
    const desiredUser = await this.UserModel.findOne({
      where: {
        uuid: id,
        isDeleted,
      },
    });

    return desiredUser;
  }

  public async findByEmail(email: string): Promise<UserDto | null> {
    const user = await this.UserModel.findOne({ where: { login: email } });
    return user;
  }

  public async findBy<K extends keyof UserDto>(
    key: K,
    value: ValueOf<UserDto>,
    isDeleted = false
  ): Promise<UserModel[]> {
    if (key === 'uuid') {
      this.validateId(value);
    }

    const desiredUsers = await this.UserModel.findAll({
      where: {
        [key]: value,
        isDeleted,
      },
    });
    return desiredUsers;
  }

  public async update(
    id: string,
    userData: UpdateUserData
  ): Promise<UserModel> {
    const desiredUser = await this.UserModel.findOne({
      where: { uuid: id },
    });
    if (desiredUser === null) {
      throw new Error(userNotFoundMessage);
    }
    const { age, login, password, groups = [] } = userData;
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
    if (groups.length > 0) {
      const groupRepository = new GroupRepository(GroupModel);
      const group = await groupRepository.findById(groups[0]);
      if (group === null) {
        console.log('group not found');
        return savedUser;
      }
      console.log(groups[0]);
      await savedUser.addGroup(group);
    }
    return savedUser;
  }

  public async delete(id: string): Promise<string> {
    this.validateId(id);
    const desiredUser = await this.UserModel.findOne({
      where: { uuid: id },
    });
    if (desiredUser === null || desiredUser.isDeleted === true) {
      this.throwError(userNotFoundMessage);
    }
    await desiredUser.update({ isDeleted: true });

    return desiredUser.uuid;
  }

  public async getAutoSuggestUsers(
    limit = 10,
    substring: string | undefined,
    findDeleted = false
  ): Promise<UserModel[]> {
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

    return users;
  }

  public async verifyPassword(
    uuid: string,
    password: string
  ): Promise<boolean> {
    const user = await this.findBy('uuid', uuid);

    if (user === null) {
      return false;
    }

    return user[0].password === password;
  }

  private async isLoginDuplicate(login: string): Promise<boolean> {
    const user = await this.UserModel.findOne({ where: { login } });
    return user !== null;
  }
}

export { UserRepository };
