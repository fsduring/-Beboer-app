import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../prisma';
import { propertySchema, departmentSchema, unitSchema } from '../schemas/structureSchemas';
import { documentCreateSchema } from '../schemas/documentSchemas';
import { registerSchema } from '../schemas/authSchemas';
import { floorplanSchema, photoMarkerSchema, photoSchema } from '../schemas/photoSchemas';
import bcrypt from 'bcrypt';

export const createProperty = async (req: AuthRequest, res: Response) => {
  const parse = propertySchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Ugyldige inputdata' });
  }
  const property = await prisma.property.create({ data: parse.data });
  res.status(201).json(property);
};

export const listProperties = async (_req: AuthRequest, res: Response) => {
  const properties = await prisma.property.findMany();
  res.json(properties);
};

export const createDepartment = async (req: AuthRequest, res: Response) => {
  const parse = departmentSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Ugyldige inputdata' });
  }
  const department = await prisma.department.create({ data: parse.data });
  res.status(201).json(department);
};

export const listDepartments = async (req: AuthRequest, res: Response) => {
  const propertyId = req.query.propertyId ? Number(req.query.propertyId) : undefined;
  const departments = await prisma.department.findMany({ where: { propertyId } });
  res.json(departments);
};

export const createUnit = async (req: AuthRequest, res: Response) => {
  const parse = unitSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Ugyldige inputdata' });
  }
  const unit = await prisma.unit.create({ data: parse.data });
  res.status(201).json(unit);
};

export const listUnits = async (req: AuthRequest, res: Response) => {
  const departmentId = req.query.departmentId ? Number(req.query.departmentId) : undefined;
  const units = await prisma.unit.findMany({ where: { departmentId } });
  res.json(units);
};

export const createUser = async (req: AuthRequest, res: Response) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Ugyldige inputdata', errors: parse.error.flatten() });
  }
  const { email, password, fullName, role, unitId } = parse.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ message: 'E-mail er allerede i brug' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash, fullName, role, unitId: unitId ?? null } });
  res.status(201).json(user);
};

export const createDocument = async (req: AuthRequest, res: Response) => {
  const parse = documentCreateSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Ugyldige inputdata' });
  }
  const data = parse.data;
  if (data.scope === 'UNIT' && !data.unitId) {
    return res.status(400).json({ message: 'Unit skal angives' });
  }
  if (data.scope === 'DEPARTMENT' && !data.departmentId) {
    return res.status(400).json({ message: 'Afdeling skal angives' });
  }
  if (data.scope === 'PROPERTY' && !data.propertyId) {
    return res.status(400).json({ message: 'Ejendom skal angives' });
  }

  const document = await prisma.document.create({
    data: {
      ...data,
      createdById: req.user!.userId,
    },
  });
  res.status(201).json(document);
};

export const listDocuments = async (req: AuthRequest, res: Response) => {
  const scope = req.query.scope as string | undefined;
  const propertyId = req.query.propertyId ? Number(req.query.propertyId) : undefined;
  const departmentId = req.query.departmentId ? Number(req.query.departmentId) : undefined;
  const unitId = req.query.unitId ? Number(req.query.unitId) : undefined;
  const documents = await prisma.document.findMany({
    where: {
      scope: scope ? (scope as any) : undefined,
      propertyId,
      departmentId,
      unitId,
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(documents);
};

export const createPhoto = async (req: AuthRequest, res: Response) => {
  const parse = photoSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Ugyldige inputdata' });
  }
  const photo = await prisma.photo.create({
    data: { ...parse.data, takenById: req.user!.userId },
  });
  res.status(201).json(photo);
};

export const listPhotos = async (req: AuthRequest, res: Response) => {
  const propertyId = req.query.propertyId ? Number(req.query.propertyId) : undefined;
  const departmentId = req.query.departmentId ? Number(req.query.departmentId) : undefined;
  const unitId = req.query.unitId ? Number(req.query.unitId) : undefined;
  const photos = await prisma.photo.findMany({
    where: { propertyId, departmentId, unitId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(photos);
};

export const createFloorplan = async (req: AuthRequest, res: Response) => {
  const parse = floorplanSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Ugyldige inputdata' });
  }
  const floorplan = await prisma.floorplan.create({ data: parse.data });
  res.status(201).json(floorplan);
};

export const listFloorplans = async (req: AuthRequest, res: Response) => {
  const propertyId = req.query.propertyId ? Number(req.query.propertyId) : undefined;
  const departmentId = req.query.departmentId ? Number(req.query.departmentId) : undefined;
  const unitId = req.query.unitId ? Number(req.query.unitId) : undefined;
  const floorplans = await prisma.floorplan.findMany({ where: { propertyId, departmentId, unitId } });
  res.json(floorplans);
};

export const createPhotoMarker = async (req: AuthRequest, res: Response) => {
  const parse = photoMarkerSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Ugyldige inputdata' });
  }
  const marker = await prisma.photoMarker.create({ data: parse.data });
  res.status(201).json(marker);
};

export const listPhotoMarkers = async (req: AuthRequest, res: Response) => {
  const floorplanId = req.query.floorplanId ? Number(req.query.floorplanId) : undefined;
  const markers = await prisma.photoMarker.findMany({ where: { floorplanId } });
  res.json(markers);
};
