import Ajv from 'ajv';

const ajv = new Ajv();

type ValidateFunc = (data: string) => boolean;
interface Validation {
  func: ValidateFunc;
  errorMessage: string;
}

ajv.addKeyword('validateString', {
  validate: function validate(
    { errorMessage, func }: Validation,
    data: string
  ): boolean {
    const isValid = func(data);
    if (isValid === false) {
      (validate as any).errors = [];
      (validate as any).errors.push({
        keyword: 'validateString',
        message: errorMessage,
        params: {
          keyword: 'validateString',
        },
      });
    }
    return isValid;
  },
  errors: true,
});

export { ajv };
