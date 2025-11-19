import { z } from 'zod';

export const propertySchema = z.object({
  name: z.string().min(2),
});

export const departmentSchema = z.object({
  name: z.string().min(2),
  propertyId: z.number(),
});

export const unitSchema = z.object({
  unitNumber: z.string().min(1),
  departmentId: z.number(),
});
