import { SORT_ORDER } from '../../constants';
import { uuidValidateSchema } from '../../utils/validation/schema';
import { IAjvSchema } from '../../utils/validation/types';

const groupNameSchema: IAjvSchema = {
  type: 'string',
};

const groupUsersSchema: IAjvSchema = {
  type: 'array',
  uniqueItems: true,
  items: {
    type: 'string',
  },
};

const groupPermissionsSchema: IAjvSchema = {
  type: 'array',
  uniqueItems: true,
  items: {
    type: 'string',
  },
};

export const getGroupSchema: IAjvSchema = {
  id: uuidValidateSchema,
};

export const getGroupsSchema: IAjvSchema = {
  type: 'object',
  properties: {
    limit: {
      type: 'integer',
      minimum: 0,
    },
    offset: {
      type: 'integer',
      minimum: 0,
    },
    sort: {
      type: 'array',
      maxItems: 2,
      items: [{ type: 'string' }, { enum: [SORT_ORDER.ASC, SORT_ORDER.DESC] }],
    },
    name: groupNameSchema,
    isDeleted: {
      type: 'integer',
    },
  },
};

export const createGroupSchema: IAjvSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: groupNameSchema,
    users: groupUsersSchema,
    permissions: groupPermissionsSchema,
  },
};

export const patchGroupSchema: IAjvSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: uuidValidateSchema,
    name: groupNameSchema,
    users: groupUsersSchema,
    permissions: groupPermissionsSchema,
  },
};

export const deleteGroupSchema: IAjvSchema = {
  id: uuidValidateSchema,
};
