import { Controller } from '../../Controller';
import {
  createGroup,
  deleteGroup,
  getGroup,
  getGroups,
  patchGroup,
} from './groups';
import {
  createGroupValidation,
  deleteGroupValidation,
  getGroupsValidation,
  getGroupValidation,
  patchGroupValidation,
} from '../validation';
import { checkIdInParams } from '../../utils/routes';

export const groupsRouter = new Controller()
  .setPath('/:id')
  .get([checkIdInParams, getGroupValidation, getGroup])
  .delete([deleteGroupValidation, deleteGroup])
  .setPath('/')
  .get([getGroupsValidation, getGroups])
  .post([createGroupValidation, createGroup])
  .patch([patchGroupValidation, patchGroup])
  .getRouter();
