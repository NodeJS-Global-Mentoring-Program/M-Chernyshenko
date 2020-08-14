import { User } from '../../../models/User';
import { validate } from 'uuid';
import { UserDto } from '../../types/DTO/UserDto';

export interface UserData {
  login: string;
  age: number;
  password: string;
}

type SortOrder = 'asc' | 'desc';

class Users {
  private users: User[];

  constructor(users: User[]) {
    this.users = users;
  }

  public addUser({ login, age, password }: UserData): User {
    const newUser = new User(login.trim(), password.trim(), age);
    this.users.push(newUser);
    return newUser;
  }

  public findBy<K extends keyof UserDto>(
    key: K,
    value: ValueOf<UserDto>,
    findDeleted = false
  ): User {
    if (key === 'id' && !validate(key)) {
      throw new Error(`id ${value} not valid`);
    }

    const desiredUser = this.users.find((user) => {
      return user[key] === value && user.isDeleted === !findDeleted;
    });
    if (desiredUser === undefined) {
      throw new Error(`user with ${key} ${value} not found`);
    }

    return desiredUser;
  }

  public getActive(): User[] {
    return this.users.filter((user) => !user.isDeleted);
  }

  public checkLoginDuplicate(login: string): boolean {
    return this.users.some((existUser) => existUser.login === login.trim());
  }

  public sortBy<K extends keyof UserData>(
    key: K,
    order: SortOrder = 'asc',
    sortFunc?: (prev: UserData[K], next: UserData[K]) => number
  ): User[] {
    if (typeof sortFunc === 'function') {
      const sortedUsers = this.users.sort((prev, next) => {
        const prevVal = prev[key];
        const nextVal = next[key];
        return sortFunc(prevVal, nextVal);
      });

      return sortedUsers;
    }

    return this.users.sort((prev, next) => {
      const prevVal = prev[key];
      const nextVal = next[key];
      if (prevVal < nextVal) {
        return -1;
      } else if (prevVal > nextVal) {
        return 1;
      }
      return 0;
    });
  }
}

export { Users };
