import {
  getUsersValidation,
  postUserValidation,
  patchUserValidation,
  deleteUserValidation,
  getUserValidation,
} from '../validation';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUser,
} from './service';
import { Controller } from '../../Controller';
import { checkIdInParams } from '../../utils/routes';

export const userRouter = new Controller()
  .setPath('/:id')
  .get([checkIdInParams, getUserValidation, getUser])
  .delete([deleteUserValidation, deleteUser])
  .setPath('/')
  .get([getUsersValidation, getUsers])
  .post([postUserValidation, createUser])
  .patch([patchUserValidation, updateUser])
  .getRouter();
