import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { config } from '../config';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const {username, password} = req.body;

    const user = await UserModel.findByUsername(username);

    if (!user) {
      res.status(401).json({message: 'Invalid credentials'});
      return;
    }

    const isPasswordValid = await UserModel.verifyPassword(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({message: 'Invalid credentials'});
      return;
    }

    const token = jwt.sign(
      {id: user.id, username: user.username},
      config.jwtSecret as jwt.Secret,
      {expiresIn: config.jwtExpiresIn} as jwt.SignOptions
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {username, password} = req.body;

    const existingUser = await UserModel.findByUsername(username);

    if (existingUser) {
      res.status(400).json({message: 'Username already exists'});
      return;
    }

    const user = await UserModel.create(username, password);

    const token = jwt.sign(
      {id: user.id, username: user.username},
      config.jwtSecret as jwt.Secret,
      {expiresIn: config.jwtExpiresIn} as jwt.SignOptions
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};
