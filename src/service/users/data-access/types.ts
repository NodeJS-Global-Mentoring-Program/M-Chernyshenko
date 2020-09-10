import { Optional } from 'sequelize/types';

export interface UserAttributes {
  id: number;
  user_id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
}

export type IUpdateUser = Pick<UserAttributes, 'age' | 'login' | 'password'>;

export type UserCreationAttributes = Optional<UserAttributes, 'id'>;
