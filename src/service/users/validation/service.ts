import { ajvValidateId, ajvUserSchema } from './utils';
import { createRequestValidator } from '../../../utils/routes';
import { NextFunction, Request, Response } from 'express';

const deleteSchema = {
  id: ajvValidateId,
};

export const deleteUserValidation = createRequestValidator(deleteSchema, false);

const validationSchema = {
  type: 'object',
  required: ['age', 'login', 'password'],
  properties: ajvUserSchema,
};

export const postUserValidation = createRequestValidator(validationSchema);

const updateSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    ...ajvUserSchema,
    id: ajvValidateId,
  },
};

export const patchUserValidation = createRequestValidator(updateSchema);

export const getUsersValidation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { limit, findDeleted } = req.query;
  if (
    limit !== undefined &&
    (typeof limit !== 'string' || isNaN(parseInt(limit, 10)))
  ) {
    res.status(400).json({ error: "'limit' have wrong format" });
    return;
  }
  if (
    findDeleted !== undefined &&
    (typeof findDeleted !== 'string' || !['0', '1'].includes(findDeleted))
  ) {
    res.status(400).json({ error: "'findDeleted' may be '0' or '1'" });
  }
  return next();
};
