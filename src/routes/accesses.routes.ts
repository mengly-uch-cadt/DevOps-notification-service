import { Router } from 'express';
import { accessesController } from '../controllers/accesses.controller';
import { validate } from '../middlewares/validate';
import { createAccessRequest, updateAccessRequest } from '../requests/accesses.request';

const router = Router();

router.post('/', validate(createAccessRequest), accessesController.create);
router.get('/', accessesController.getAll);
router.get('/:global_id', accessesController.getById);
router.put('/:global_id', validate(updateAccessRequest), accessesController.update);
router.delete('/:global_id', accessesController.delete);

export default router;
