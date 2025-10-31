import { Router } from 'express';
import { login, register } from '../controllers/authController';
import { validateLogin } from '../middleware/validation';

const router = Router();

router.post('/login', validateLogin, login);
router.post('/register', validateLogin, register);

export default router;
