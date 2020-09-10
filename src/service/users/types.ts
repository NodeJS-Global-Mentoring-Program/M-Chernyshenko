export interface UserDto {
  user_id: string;
  login: string;
  age: number;
  isDeleted: boolean;
  password?: string;
}
