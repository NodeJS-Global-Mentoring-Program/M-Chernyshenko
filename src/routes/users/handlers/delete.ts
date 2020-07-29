import { Request, Response } from 'express';
import { users } from '../../../database';
import { validate } from 'uuid';

const deleteUser = (req: Request, res: Response): void => {
  const { id } = req.query;
  if (typeof id !== 'string') {
    res.status(400).json({ error: 'user id was not provided' });
    return;
  }
  const desiredUser = users
    .filter((user) => !user.isDeleted && validate(id))
    .find((user) => user.id === id);
  if (desiredUser === undefined) {
    res.status(410);
  } else {
    desiredUser.delete();
    res.status(204);
  }
  res.send();
};

export { deleteUser };
