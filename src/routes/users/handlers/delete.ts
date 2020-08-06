import { Request, Response } from 'express';
import { database } from '../../../database';
import { ajvValidateId } from './utils';
import { createRequestValidator } from '../../helpers';

const schema = {
  id: ajvValidateId,
};

export const deleteUserValidation = createRequestValidator(schema, false);

const deleteUser = (req: Request, res: Response): void => {
  const id = req.query.id as string;
  const desiredUser = database.users.findBy('id', id);
  if (desiredUser === undefined) {
    res.status(410);
  } else {
    desiredUser.delete();
    res.status(204);
  }
  res.send();
};

export { deleteUser };
