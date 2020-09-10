import { validate as uuidValidate } from 'uuid';

const validatePassword = (password: string): boolean => {
  const digits = /\d+/;
  const letters = /[a-zA-Z_-]+/;
  const res = digits.test(password) && letters.test(password);
  return res;
};

export const ajvUserSchema = {
  age: {
    type: 'integer',
    minimum: 4,
    maximum: 130,
  },
  login: {
    type: 'string',
    format: 'email',
  },
  password: {
    type: 'string',
    minLength: 8,
    validateString: {
      errorMessage: 'password must contain at least one digit and one letter',
      func: validatePassword,
    },
  },
};

export const ajvValidateId = {
  type: 'string',
  validateString: {
    errorMessage: 'id not valid',
    func: (id: string): boolean => uuidValidate(id),
  },
};
