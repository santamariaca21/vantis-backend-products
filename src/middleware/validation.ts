import { Request, Response, NextFunction } from 'express';

export const validateProduct = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const {name, price, stock} = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400).json({message: 'Name is required and must be a string'});
    return;
  }

  if (name.length > 100) {
    res.status(400).json({message: 'Name must not exceed 100 characters'});
    return;
  }

  if (price === undefined || typeof price !== 'number' || price <= 0) {
    res.status(400).json({message: 'Price must be a positive number'});
    return;
  }

  if (stock === undefined || typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock)) {
    res.status(400).json({message: 'Stock must be a non-negative integer'});
    return;
  }

  next();
};

export const validateStockUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const stock = parseInt(req.query.stock as string);

  if (isNaN(stock) || stock < 0) {
    res.status(400).json({message: 'Stock must be a non-negative integer'});
    return;
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const {username, password} = req.body;

  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    res.status(400).json({message: 'Username is required'});
    return;
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    res.status(400).json({message: 'Password is required'});
    return;
  }

  next();
};
