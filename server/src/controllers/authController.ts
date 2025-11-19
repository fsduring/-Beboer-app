import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { loginSchema, registerSchema } from '../schemas/authSchemas';

export const register = async (req: Request, res: Response) => {
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
  const user = await prisma.user.create({
    data: { email, passwordHash, fullName, role, unitId: unitId ?? null },
  });

  res.status(201).json({ id: user.id, email: user.email });
};

export const login = async (req: Request, res: Response) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Ugyldige inputdata' });
  }

  const { email, password } = parse.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Forkert e-mail eller adgangskode' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Forkert e-mail eller adgangskode' });
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role, unitId: user.unitId },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '12h' }
  );

  res.json({ token });
};
