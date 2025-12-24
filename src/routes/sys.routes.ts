import { Router } from 'express';
import { usersController } from '../controllers/users.controller';
import { validate } from '../middlewares/validate';
import { createUserRequest, updateUserRequest } from '../requests/users.request';
import { authenticateBasicAuth } from '../middlewares/auth.basicAuth';

const router = Router();

// All system routes require Basic Auth (no JWT needed)
router.use(authenticateBasicAuth);

// User CRUD for external systems
router.post('/users', validate(createUserRequest), usersController.create);
router.get('/users', usersController.getAll);
router.get('/users/:global_id', usersController.getById);
router.put('/users/:global_id', validate(updateUserRequest), usersController.update);
router.delete('/users/:global_id', usersController.delete);

export default router;
