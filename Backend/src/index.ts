import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRoutes, taskRoutes, userRoutes } from './routes';
import * as taskController from './controllers/taskController';
import { ping } from './controllers/healthController';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);
app.use('/auth/users', userRoutes);
app.use('/auth/tasks', taskRoutes);
app.get('/auth/all-tasks', taskController.listAllTasks);
app.get('/health', ping);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
