import { validate } from 'uuid';
import { IAjvSchema } from './types';

export const uuidValidateSchema: IAjvSchema = {
  type: 'string',
  validateString: {
    errorMessage: 'id not valid',
    cb: (id: string): boolean => validate(id),
  },
} as const;
