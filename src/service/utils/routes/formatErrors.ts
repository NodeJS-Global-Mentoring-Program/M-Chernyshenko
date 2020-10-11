import { ErrorObject } from 'ajv';
import { ApiError } from '../ApiError';

class ValidationError extends ApiError {
  private field: string;

  constructor(field: string, message: string) {
    super({ code: 400, message });
    this.field = field;
  }

  public getField(): string {
    return this.field;
  }
}

const formatValidationErrors = (
  errors: ErrorObject[] | null | undefined
): ValidationError[] => {
  if (errors === undefined || errors === null) {
    throw new Error('Errors not found');
  }
  const apiErrors = errors.map(
    (error) => new ValidationError(error.dataPath, error.message ?? '')
  );
  return apiErrors;
};

export { formatValidationErrors as formatErrors };
