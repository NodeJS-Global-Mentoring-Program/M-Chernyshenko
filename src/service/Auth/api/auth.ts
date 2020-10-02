import { ApiMiddleware } from '../../types';
import { UserModel, UserRepository } from '../../Users/data-access';
import { ApiError } from '../../utils/ApiError';
import { ApiResponse } from '../../utils/ApiResponse';
import { JwtToken } from '../../utils/auth';
import { LoginBody } from '../types';

const userRepository = new UserRepository(UserModel);

export const login: ApiMiddleware<LoginBody> = async (req, res, next) => {
  const failedLoginError = new ApiError({
    code: 400,
    message: 'Login or password incorrect',
  });
  const { login: userLogin, password } = req.body;

  const user = await userRepository.findByEmail(userLogin);

  if (user === null) {
    return next(failedLoginError);
  }
  const isPasswordCorrect = await userRepository.verifyPassword(
    user.uuid,
    password
  );
  if (isPasswordCorrect === false) {
    return next(failedLoginError);
  }

  const token = new JwtToken().sign({ uuid: user.uuid });
  return res.json(new ApiResponse({ data: { access_token: token } }));
};
