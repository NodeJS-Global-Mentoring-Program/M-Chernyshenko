import faker from 'faker';
import { User } from '../../../models/User';

const generateFakeUser = (): User => {
  const login = faker.internet.email();
  const password = faker.internet.password();
  const age = faker.random.number({
    min: 18,
    max: 80,
  });

  const user = new User(login, password, age);
  return user;
};

const createUsers = (count = 10): User[] =>
  Array.from({ length: count }).map(() => {
    return generateFakeUser();
  });

export { createUsers };
