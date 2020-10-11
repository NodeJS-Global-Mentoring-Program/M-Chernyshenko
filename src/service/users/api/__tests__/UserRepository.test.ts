import { UserModel } from '../../data-access';
import { UserRepository } from '../UserRepository';
import crypto from 'crypto';

jest.mock('../../data-access/UserModel.ts');

describe('UserRepository spec', () => {
  const userRepository = new UserRepository(UserModel);
  test('should return created user if login not duplicate', async () => {
    const user = {
      age: 17,
      login: 'login1',
      password: 'password',
      uuid: '8e3f174f-e5a4-4f47-b5ff-71c19d7c0825',
    };
    const newUser = await userRepository.create(user);
    const encryptedPassword = crypto
      .createHmac('sha512', 'someSalt')
      .update(user.password)
      .digest('hex');
    expect(newUser).toEqual({ ...user, password: encryptedPassword });
  });

  test('should throw error if login is duplicate', async () => {
    const user = {
      age: 17,
      login: 'login',
      password: 'password',
      uuid: '8e3f174f-e5a4-4f47-b5ff-71c19d7c0825',
    };
    try {
      await userRepository.create(user);
    } catch (e) {
      expect(e).toEqual(new Error('User already exist'));
    }
  });
});
