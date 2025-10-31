import { Router } from 'express';
import {
  getAllProducts,
  createProduct,
  updateProductStock,
  deleteProduct,
} from '../controllers/productController';
import { authenticateToken } from '../middleware/auth';
import { validateProduct, validateStockUpdate } from '../middleware/validation';

const router = Router();

router.use(authenticateToken);

router.get('/', getAllProducts);
router.post('/', validateProduct, createProduct);
router.put('/:id/stock', validateStockUpdate, updateProductStock);
router.delete('/:id', deleteProduct);

export default router;
