import { v4 } from 'uuid';
import { UserDto } from './types';

class User implements UserDto {
  private _age: number;
  private _login: string;
  private _password: string;
  private _isDeleted = false;
  private _userId = v4();

  constructor(login: string, password: string, age: number) {
    this._age = age;
    this._login = login;
    this._password = password;
  }

  public get user_id(): string {
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

  public toEntity(): Required<UserDto> {
    return {
      age: this._age,
      isDeleted: this._isDeleted,
      login: this._login,
      user_id: this._userId,
      password: this._password,
    };
  }
}

export { User };
