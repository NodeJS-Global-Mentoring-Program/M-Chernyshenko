import { ErrorObject } from 'ajv';

interface ApiValidationError {
  field: string;
  message?: string;
}

const formatErrors = (
  errors: ErrorObject[] | null | undefined
): ApiValidationError[] => {
  if (errors === undefined || errors === null) {
    throw new Error('Errors not found');
  }
  const apiErrors = errors.map((error) => ({
    field: error.dataPath,
    message: error.message,
  }));
  return apiErrors;
};

export { formatErrors };
