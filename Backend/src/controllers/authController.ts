import * as authService from '../services/authService';
import { validateRegister } from '../utils/validation';

export const register = async (req: any, res: any) => {
  try {
    const { name, email, password } = req.body;
  const errors = validateRegister({ name, email, password });
  if (errors.length) return res.status(400).json({ error: 'Entrada inválida', fields: errors });
    const result = await authService.register(name, email, password);
    return res.status(201).json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Se requieren email y contraseña' });
    const result = await authService.login(email, password);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};
