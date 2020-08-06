import { Router } from 'express';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  receiveUserValidation,
  createUserValidation,
  updateUserValidation,
  deleteUserValidation,
} from './handlers';

const router = Router();

router
  .route('/')
  .get(receiveUserValidation, getUsers)
  .post(createUserValidation, createUser)
  .patch(updateUserValidation, updateUser)
  .delete(deleteUserValidation, deleteUser);

export { router as userRouter };
