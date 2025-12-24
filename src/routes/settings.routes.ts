import { Router } from 'express';
import * as controller from '../controllers/settings.controller';
import * as request from '../requests/settings.request';
import { validate } from '../middlewares/validate';
import {
  createSettingSchema,
  updateSettingSchema,
  paginationQuerySchema,
  getBySlugKeySchema,
} from '../schemas/settings.schema';

const router = Router();

router.post('/', validate(createSettingSchema), request.createRequest, controller.create);
router.get('/', validate(paginationQuerySchema), request.paginationRequest, controller.getAll);
router.get('/:global_id', request.globalIdRequest, controller.getByGlobalId);
router.get('/slug/:slug/:key', validate(getBySlugKeySchema), request.slugKeyRequest, controller.getBySlugKey);
router.put('/:global_id', validate(updateSettingSchema), request.updateRequest, controller.update);
router.delete('/:global_id', request.idRequest, controller.deleteById);

export default router;
