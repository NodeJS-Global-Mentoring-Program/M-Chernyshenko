import { v1 } from 'uuid';
import { UserDto } from '../types/DTO/UserDto';
import { UserData } from '../database/users/Users';

class User {
  private _isDeleted = false;
  private _login: string;
  private _age: number;
  private _password: string;
  private _id: string;

  constructor(login: string, password: string, age: number) {
    this._age = age;
    this._login = login;
    this._password = password;
    this._id = v1();
  }

  public get id(): string {
    return this._id;
  }

  public get login(): string {
    return this._login;
  }

  public set login(login: string) {
    this._login = login;
  }

  public set password(password: string) {
    this._password = password;
  }

  public set age(age: number) {
    this._age = age;
  }

  public get isDeleted(): boolean {
    return this._isDeleted;
  }

  public delete(): void {
    this._isDeleted = true;
  }

  public update(userData: Partial<UserData>): User {
    const { age, login, password } = userData;
    if (typeof age === 'number') {
      this._age = age;
    }
    if (typeof login === 'string') {
      this._login = login;
    }
    if (typeof password === 'string') {
      this._password = password;
    }
    return this;
  }

  public toApi(): UserDto {
    return {
      login: this._login,
      id: this._id,
      age: this._age,
      isDeleted: this._isDeleted,
      password: this._password,
    };
  }
}

export { User };
