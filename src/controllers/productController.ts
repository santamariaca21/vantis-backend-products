import { Request, Response } from 'express';
import { ProductModel } from '../models/Product';

export const getAllProducts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await ProductModel.findAll();
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {name, price, stock} = req.body;

    const product = await ProductModel.create({name, price, stock});

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};

export const updateProductStock = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const stock = parseInt(req.query.stock as string);

    if (isNaN(id)) {
      res.status(400).json({message: 'Invalid product ID'});
      return;
    }

    const product = await ProductModel.updateStock(id, stock);

    if (!product) {
      res.status(404).json({message: 'Product not found'});
      return;
    }

    res.json(product);
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({message: 'Invalid product ID'});
      return;
    }

    const deleted = await ProductModel.delete(id);

    if (!deleted) {
      res.status(404).json({message: 'Product not found'});
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};
