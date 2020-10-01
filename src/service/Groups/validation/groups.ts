import {
  RequestValidator,
  REQUEST_PAYLOAD_TYPE,
} from '../../utils/validation/RequestValidator';
import {
  createGroupSchema,
  deleteGroupSchema,
  getGroupSchema,
  getGroupsSchema,
  patchGroupSchema,
} from './schema';

const validator = new RequestValidator({
  coerceTypes: true,
  removeAdditional: true,
});

export const getGroupValidation = validator.createRequestValidator(
  getGroupSchema,
  REQUEST_PAYLOAD_TYPE.params
);

export const getGroupsValidation = validator.createRequestValidator(
  getGroupsSchema,
  REQUEST_PAYLOAD_TYPE.query
);
export const createGroupValidation = validator.createRequestValidator(
  createGroupSchema
);
export const patchGroupValidation = validator.createRequestValidator(
  patchGroupSchema
);
export const deleteGroupValidation = validator.createRequestValidator(
  deleteGroupSchema,
  REQUEST_PAYLOAD_TYPE.params
);
