import { Request, Response } from 'express';
import { database } from '../../../database';
import { ajvValidateId } from './utils';
import { ajv } from '../../../utils/ajv';
import { formatErrors } from '../../helpers';

const schema = {
  id: ajvValidateId,
};

const validate = ajv.compile(schema);

const deleteUser = (req: Request, res: Response): void => {
  const { id } = req.query;
  const validationResult = validate(id);
  if (validationResult === false || typeof id !== 'string') {
    const errors = formatErrors(validate.errors);
    res.status(400).json({ errors });
    return;
  }
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
