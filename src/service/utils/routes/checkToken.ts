import { ApiMiddleware } from '../../types';
import { ApiError } from '../ApiError';
import { JwtToken } from '../auth';

export const checkToken: ApiMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization === undefined) {
    return next(new ApiError({ code: 401, message: 'Unauthorized' }));
  }

  const token = authorization.split(' ')[1];
  try {
    const userData = new JwtToken().verify(token);
    (req as any).user = { uuid: userData.uuid };
    return next();
  } catch (e) {
    return next(new ApiError({ code: 403, message: e.message }));
  }
};
