import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { getMyDocuments, getProfile, registerDocumentOpen } from '../controllers/tenantController';

const router = Router();

router.get('/me', requireAuth, getProfile);
router.get('/my/documents', requireAuth, getMyDocuments);
router.post('/documents/:id/open', requireAuth, requireRole('TENANT'), registerDocumentOpen);

export default router;
