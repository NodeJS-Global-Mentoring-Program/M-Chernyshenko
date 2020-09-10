import { Router } from 'express';
import {
  getUsersValidation,
  postUserValidation,
  patchUserValidation,
  deleteUserValidation,
} from '../validation';
import { getUsers, createUser, updateUser, deleteUser } from '../api';
import { handleMiddlewares } from '../../../utils/routes';

const router = Router();

router
  .route('/')
  .get(handleMiddlewares([getUsersValidation, getUsers]))
  .post(handleMiddlewares([postUserValidation, createUser]))
  .patch(handleMiddlewares([patchUserValidation, updateUser]))
  .delete(handleMiddlewares([deleteUserValidation, deleteUser]));

export { router as userRouter };
