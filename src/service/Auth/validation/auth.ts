import { RequestValidator } from '../../utils/validation/RequestValidator';
import { IAjvSchema } from '../../utils/validation/types';

const loginSchema: IAjvSchema = {
  type: 'object',
  required: ['login', 'password'],
  properties: {
    login: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
  },
};

const validator = new RequestValidator();

export const loginValidation = validator.createRequestValidator(loginSchema);
