import { generateFakeUser } from '../routes/users/helpers';

const users = Array.from({ length: 10 }).map(() => {
  return generateFakeUser();
});

export { users };