import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../prisma';

export const getProfile = async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      unitId: true,
      unit: {
        select: {
          id: true,
          unitNumber: true,
          department: {
            select: {
              id: true,
              name: true,
              property: {
                select: { id: true, name: true },
              },
            },
          },
        },
      },
    },
  });
  res.json(user);
};

export const getMyDocuments = async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    include: {
      unit: {
        include: {
          department: { include: { property: true } },
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ message: 'Bruger ikke fundet' });
  }

  if (user.role !== 'TENANT' || !user.unit) {
    return res.json([]);
  }

  const departmentId = user.unit.departmentId;
  const propertyId = user.unit.department.propertyId;

  const documents = await prisma.document.findMany({
    where: {
      OR: [
        { scope: 'UNIT', unitId: user.unitId },
        { scope: 'DEPARTMENT', departmentId },
        { scope: 'PROPERTY', propertyId },
      ],
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(documents);
};

export const registerDocumentOpen = async (req: AuthRequest, res: Response) => {
  const documentId = Number(req.params.id);
  const userId = req.user!.userId;

  const document = await prisma.document.findUnique({ where: { id: documentId } });
  if (!document) {
    return res.status(404).json({ message: 'Dokument ikke fundet' });
  }

  const now = new Date();
  const existing = await prisma.documentRead.findUnique({
    where: { documentId_userId: { documentId, userId } },
  });

  if (!existing) {
    await prisma.documentRead.create({
      data: {
        documentId,
        userId,
        firstOpenedAt: now,
        lastOpenedAt: now,
        openCount: 1,
      },
    });
  } else {
    await prisma.documentRead.update({
      where: { id: existing.id },
      data: { lastOpenedAt: now, openCount: existing.openCount + 1 },
    });
  }

  res.json({ message: 'Registreret' });
};
