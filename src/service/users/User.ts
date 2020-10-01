import { v4 } from 'uuid';
import { UserDto } from './types';

type UserDataForCreate = Required<Pick<UserDto, 'age' | 'login' | 'password'>> &
  Pick<UserDto, 'groups'>;

class User implements UserDto {
  private _age: number;
  private _login: string;
  private _password: string;
  private _groups: string[];
  private _isDeleted = false;
  private _userId = v4();

  constructor(userData: UserDataForCreate) {
    this._age = userData.age;
    this._login = userData.login;
    this._password = userData.password;
    this._groups = userData.groups ?? [];
  }

  public get uuid(): string {
    return this._userId;
  }

  public get login(): string {
    return this._login;
  }

  public set login(login: string) {
    this._login = login;
  }

  public get isDeleted(): boolean {
    return this._isDeleted;
  }

  public get password(): string {
    return this._password;
  }

  public set password(password: string) {
    this._password = password;
  }

  public get age(): number {
    return this._age;
  }

  public set age(age: number) {
    this._age = age;
  }

  public toJson(): Required<UserDto> {
    return {
      age: this._age,
      isDeleted: this._isDeleted,
      login: this._login,
      uuid: this._userId,
      password: this._password,
      groups: this._groups,
    };
  }
}

export { User };
