import { Request, Response, NextFunction } from 'express';
import { getAutoSuggestUsers } from '../helpers';

export const receiveUserValidation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { limit } = req.query;
  if (
    limit !== undefined &&
    (typeof limit !== 'string' || isNaN(parseInt(limit, 10)))
  ) {
    res.status(400).json({ error: "'limit' have wrong format" });
    return;
  }
  next();
};

export const getUsers = (req: Request, res: Response): void => {
  const { limit, loginSubstring } = req.query;
  const suggestedUsers = getAutoSuggestUsers(
    typeof limit === 'string' && !isNaN(parseInt(limit, 10))
      ? parseInt(limit, 10)
      : undefined,
    typeof loginSubstring === 'string'
      ? loginSubstring.toLowerCase()
      : undefined
  );
  const usersForApi = suggestedUsers.map((user) => user.toApi());
  res.json({
    users: usersForApi,
  });
};
