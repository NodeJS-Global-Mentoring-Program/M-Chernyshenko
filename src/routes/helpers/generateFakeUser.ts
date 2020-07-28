import faker from 'faker';
import { User } from '../../Models/User';

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

export { generateFakeUser };
