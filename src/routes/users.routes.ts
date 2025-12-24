import { Router } from 'express';
import { usersController } from '../controllers/users.controller';
import { validate } from '../middlewares/validate';
import { createUserRequest, updateUserRequest } from '../requests/users.request';

const router = Router();

router.post('/', validate(createUserRequest), usersController.create);
router.get('/', usersController.getAll);
router.get('/:global_id', usersController.getById);
router.put('/:global_id', validate(updateUserRequest), usersController.update);
router.delete('/:global_id', usersController.delete);

export default router;
