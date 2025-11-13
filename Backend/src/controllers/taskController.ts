import * as taskService from '../services/taskService';

export const createTask = async (req: any, res: any) => {
  try {
  const userId = (req as any).userId;
  const task = await taskService.createTask(userId, req.body);
    res.status(201).json(task);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const listTasks = async (req: any, res: any) => {
  try {
  const userId = (req as any).userId;
  const { status, priority } = req.query as any;
  const tasks = await taskService.listTasks(userId, { status, priority });
    res.json(tasks);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getTask = async (req: any, res: any) => {
  try {
  const id = Number(req.params.id);
  const task = await taskService.getTask(id);
  if (!task) return res.status(404).json({ error: 'No encontrado' });
    res.json(task);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateTask = async (req: any, res: any) => {
  try {
  const id = Number(req.params.id);
  const patch = req.body;
  const task = await taskService.updateTask(id, patch);
    res.json(task);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteTask = async (req: any, res: any) => {
  try {
  const id = Number(req.params.id);
  await taskService.deleteTask(id);
  res.json({ success: true, message: 'Eliminado correctamente' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
