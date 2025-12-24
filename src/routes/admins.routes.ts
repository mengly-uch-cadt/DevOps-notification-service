import { Router } from 'express';
import { adminsController } from '../controllers/admins.controller';
import { validate } from '../middlewares/validate';
import { createAdminRequest, updateAdminRequest } from '../requests/admins.request';

const router = Router();

router.post('/', validate(createAdminRequest), adminsController.create);
router.get('/', adminsController.getAll);
router.get('/:global_id', adminsController.getById);
router.put('/:global_id', validate(updateAdminRequest), adminsController.update);
router.delete('/:global_id', adminsController.delete);

export default router;
