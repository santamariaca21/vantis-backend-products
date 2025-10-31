import pool from '../config/database';
import { Product } from '../types';

const parseProduct = (row: any): Product => {
  return {
    ...row,
    price: parseFloat(row.price),
    stock: parseInt(row.stock, 10)
  };
};

export class ProductModel {
  static async findAll(): Promise<Product[]> {
    const result = await pool.query(
      'SELECT id, name, price, stock, created_at, updated_at FROM products ORDER BY id ASC'
    );
    return result.rows.map(parseProduct);
  }

  static async create(product: Product): Promise<Product> {
    const {name, price, stock} = product;
    const result = await pool.query(
      'INSERT INTO products (name, price, stock) VALUES ($1, $2, $3) RETURNING id, name, price, stock, created_at, updated_at',
      [name, price, stock]
    );
    return parseProduct(result.rows[0]);
  }

  static async updateStock(id: number, stock: number): Promise<Product | null> {
    const result = await pool.query(
      'UPDATE products SET stock = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, price, stock, created_at, updated_at',
      [stock, id]
    );
    return result.rows[0] ? parseProduct(result.rows[0]) : null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}
