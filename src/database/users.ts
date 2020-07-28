import { generateFakeUser } from '../routes/helpers';

const users = Array.from({ length: 10 }).map(() => {
  return generateFakeUser();
});

export { users };