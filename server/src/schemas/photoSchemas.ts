import { z } from 'zod';

export const photoSchema = z.object({
  url: z.string().url(),
  note: z.string().optional(),
  propertyId: z.number().optional(),
  departmentId: z.number().optional(),
  unitId: z.number().optional(),
});

export const floorplanSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().url(),
  propertyId: z.number().optional(),
  departmentId: z.number().optional(),
  unitId: z.number().optional(),
});

export const photoMarkerSchema = z.object({
  photoId: z.number(),
  floorplanId: z.number(),
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});
