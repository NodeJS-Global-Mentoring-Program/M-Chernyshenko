import { ApiMiddleware } from '../../types';

export const checkIdInParams: ApiMiddleware<any, any, { id: string }> = async (
  req,
  res,
  next
) => {
  if (req.params.id !== undefined) {
    return next();
  }
  return next('router');
};
