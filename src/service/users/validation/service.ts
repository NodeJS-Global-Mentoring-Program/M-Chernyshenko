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

export const createUserValidation = createRequestValidator(validationSchema);

const updateSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    ...ajvUserSchema,
    id: ajvValidateId,
  },
};

export const updateUserValidation = createRequestValidator(updateSchema);

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
