import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: Role;
    unitId?: number | null;
  };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Du skal være logget ind for at se denne ressource' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as AuthRequest['user'];
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Ugyldig session, log venligst ind igen' });
  }
};

export const requireRole = (roles: Role | Role[]) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Du skal være logget ind for at se denne ressource' });
    }
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ message: 'Adgang nægtet' });
    }
    next();
  };
};
