import { Router } from 'express';
import * as taskController from '../controllers/taskController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.post('/', taskController.createTask);
router.get('/', taskController.listTasks);
router.get('/:id', taskController.getTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
