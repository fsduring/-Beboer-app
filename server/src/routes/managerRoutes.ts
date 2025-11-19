import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import {
  createDepartment,
  createDocument,
  createFloorplan,
  createPhoto,
  createPhotoMarker,
  createProperty,
  createUnit,
  createUser,
  listDepartments,
  listDocuments,
  listFloorplans,
  listPhotoMarkers,
  listPhotos,
  listProperties,
  listUnits,
} from '../controllers/managerController';

const router = Router();
const siteManagerOnly = [requireAuth, requireRole('SITE_MANAGER')] as const;

router.post('/properties', ...siteManagerOnly, createProperty);
router.get('/properties', ...siteManagerOnly, listProperties);
router.post('/departments', ...siteManagerOnly, createDepartment);
router.get('/departments', ...siteManagerOnly, listDepartments);
router.post('/units', ...siteManagerOnly, createUnit);
router.get('/units', ...siteManagerOnly, listUnits);
router.post('/users', ...siteManagerOnly, createUser);
router.post('/documents', ...siteManagerOnly, createDocument);
router.get('/documents', requireAuth, requireRole(['SITE_MANAGER', 'ADVISOR']), listDocuments);
router.post('/photos', ...siteManagerOnly, createPhoto);
router.get('/photos', requireAuth, requireRole(['SITE_MANAGER', 'ADVISOR']), listPhotos);
router.post('/floorplans', ...siteManagerOnly, createFloorplan);
router.get('/floorplans', requireAuth, requireRole(['SITE_MANAGER', 'ADVISOR']), listFloorplans);
router.post('/photo-markers', ...siteManagerOnly, createPhotoMarker);
router.get('/photo-markers', requireAuth, requireRole(['SITE_MANAGER', 'ADVISOR']), listPhotoMarkers);

export default router;
