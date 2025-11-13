import * as taskRepo from '../repositories/taskRepository';
import { validateTask } from '../utils/validation';

export const createTask = async (userId: number, payload: any) => {
  const errors = validateTask(payload);
  if (errors.length) throw new Error('Entrada inválida: ' + errors.join(','));
  return await taskRepo.createTask({ user_id: userId, title: payload.title, description: payload.description, priority: payload.priority, status: payload.status });
};

export const listTasks = async (userId: number, filters: any) => {
  return await taskRepo.getTasksByUser(userId, filters);
};

export const getTask = async (id: number) => {
  return await taskRepo.getTaskById(id);
};

export const updateTask = async (id: number, patch: any) => {
  // Allowable fields only
  const allowed = ['title','description','priority','status'];
  const clean: any = {};
  for (const k of Object.keys(patch)) if (allowed.includes(k)) clean[k] = patch[k];
  const errors = validateTask(clean, true);
  if (errors.length) throw new Error('Entrada inválida: ' + errors.join(','));
  return await taskRepo.updateTask(id, clean);
};

export const deleteTask = async (id: number) => {
  return await taskRepo.deleteTask(id);
};
