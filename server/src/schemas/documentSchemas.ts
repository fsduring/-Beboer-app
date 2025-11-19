import { z } from 'zod';

export const documentCreateSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(1),
  fileUrl: z.string().url().optional(),
  scope: z.enum(['UNIT', 'DEPARTMENT', 'PROPERTY']),
  propertyId: z.number().optional(),
  departmentId: z.number().optional(),
  unitId: z.number().optional(),
});
