import { Users } from './users';
import { createUsers } from './users/utils';

class Database {
  public users = new Users(createUsers(10));
}

const database = new Database();

export { database };
