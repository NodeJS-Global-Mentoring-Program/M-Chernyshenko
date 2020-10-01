export interface UserDto {
  uuid: string;
  login: string;
  age: number;
  isDeleted?: boolean;
  password?: string;
  groups?: string[];
}
