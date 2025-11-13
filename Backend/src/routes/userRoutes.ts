import { Router } from 'express';
import * as userController from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();
// autenticador de token
router.use(authMiddleware);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
