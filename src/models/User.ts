import pool from '../config/database';
import { User } from '../types';
import bcrypt from 'bcrypt';

export class UserModel {
  static async findByUsername(username: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT id, username, password, created_at FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0] || null;
  }

  static async create(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, created_at',
      [username, hashedPassword]
    );
    return result.rows[0];
  }

  static async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
