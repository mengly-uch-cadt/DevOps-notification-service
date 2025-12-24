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
router.get('/id/:id', request.idRequest, controller.getById);
router.get('/global/:global_id', request.globalIdRequest, controller.getByGlobalId);
router.get('/:slug/:key', validate(getBySlugKeySchema), request.slugKeyRequest, controller.getBySlugKey);
router.put('/:id', validate(updateSettingSchema), request.updateRequest, controller.update);
router.delete('/:id', request.idRequest, controller.deleteById);

export default router;
