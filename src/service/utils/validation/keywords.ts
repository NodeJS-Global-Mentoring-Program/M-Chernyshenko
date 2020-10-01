import { IAjvKeyword } from './types';

type ValidateFunc = (data: string) => boolean;
interface Validation {
  cb: ValidateFunc;
  errorMessage: string;
}

function validateStringFunc(
  { errorMessage, cb }: Validation,
  data: string
): boolean {
  const isValid = cb(data);
  if (isValid === false) {
    (validateString as any).errors = [];
    (validateString as any).errors.push({
      keyword: 'validateString',
      message: errorMessage,
      params: {
        keyword: 'validateString',
      },
    });
  }
  return isValid;
}

export const validateString: IAjvKeyword = {
  key: 'validateString',
  definition: {
    validate: validateStringFunc,
    errors: true,
  },
};
