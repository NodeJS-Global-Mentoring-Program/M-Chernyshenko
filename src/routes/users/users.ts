import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from './handlers';

const router = Router();

router
  .route('/')
  .get(getUsers)
  .post(createUser)
  .patch(updateUser)
  .delete(deleteUser);

export { router as userRouter };
