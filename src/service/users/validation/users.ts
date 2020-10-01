import { ajvUserSchema } from './utils';
import {
  RequestValidator,
  REQUEST_PAYLOAD_TYPE,
} from '../../utils/validation/RequestValidator';
import { ApiMiddleware } from '../../types';
import { uuidValidateSchema } from '../../utils/validation/schema';

const validator = new RequestValidator();

const deleteUserSchema = {
  id: uuidValidateSchema,
};

const getUserSchema = {
  id: uuidValidateSchema,
};

export const deleteUserValidation = validator.createRequestValidator(
  deleteUserSchema,
  REQUEST_PAYLOAD_TYPE.params
);

const createUserSchema = {
  type: 'object',
  required: ['age', 'login', 'password'],
  properties: ajvUserSchema,
};

export const postUserValidation = validator.createRequestValidator(
  createUserSchema
);

const updateUserSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    ...ajvUserSchema,
    id: uuidValidateSchema,
  },
};

export const patchUserValidation = validator.createRequestValidator(
  updateUserSchema
);

export const getUserValidation = validator.createRequestValidator(
  getUserSchema,
  REQUEST_PAYLOAD_TYPE.params
);

export const getUsersValidation: ApiMiddleware = (req, res, next) => {
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
    return;
  }
  return next();
};
