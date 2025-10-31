import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthRequest, JwtPayload } from '../types';

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({message: 'Access token required'});
    return;
  }

  try {
    req.user = jwt.verify(token, config.jwtSecret) as JwtPayload;
    next();
  } catch (error) {
    res.status(401).json({message: 'Invalid or expired token'});
    return;
  }
};
