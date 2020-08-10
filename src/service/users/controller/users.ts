import { Router } from 'express';
import {
  receiveUserValidation,
  createUserValidation,
  updateUserValidation,
  deleteUserValidation,
} from '../validation';
import { getUsers, createUser, updateUser, deleteUser } from '../api';

const router = Router();

router
  .route('/')
  .get(receiveUserValidation, getUsers)
  .post(createUserValidation, createUser)
  .patch(updateUserValidation, updateUser)
  .delete(deleteUserValidation, deleteUser);

export { router as userRouter };
