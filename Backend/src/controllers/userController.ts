import * as userService from '../services/userService';

export const getAllUsers = async (req: any, res: any) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getUser = async (req: any, res: any) => {
  try {
    const id = Number(req.params.id);
    const user = await userService.getUser(id);
    if (!user) return res.status(404).json({ error: 'No encontrado' });
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateUser = async (req: any, res: any) => {
  try {
    const id = Number(req.params.id);
    const patch = req.body;
    const user = await userService.updateUser(id, patch);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteUser = async (req: any, res: any) => {
  try {
    const id = Number(req.params.id);
    await userService.deleteUser(id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
