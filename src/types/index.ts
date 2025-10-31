import { Request } from 'express';

export interface Product {
  id?: number;
  name: string;
  price: number;
  stock: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface User {
  id?: number;
  username: string;
  password: string;
  created_at?: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
  };
}

export interface JwtPayload {
  id: number;
  username: string;
}
