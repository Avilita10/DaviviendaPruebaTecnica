import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail } from '../repositories/userRepository';
import dotenv from 'dotenv';
import { validateRegister } from '../utils/validation';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (name: string, email: string, password: string) => {
  const errors = validateRegister({ name, email, password });
  if (errors.length) throw new Error('Entrada inválida: ' + errors.join(','));
  const existing = await getUserByEmail(email);
  if (existing) throw new Error('El correo ya está registrado');
  const hash = await bcrypt.hash(password, 10);
  const user = await createUser({ name, email, password_hash: hash });
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '1h' });
  return { user: { id: user.id, name: user.name, email: user.email }, token };
};

export const login = async (email: string, password: string) => {
  const user = await getUserByEmail(email);
  if (!user) throw new Error('Credenciales inválidas');
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new Error('Credenciales inválidas');
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '1h' });
  return { user: { id: user.id, name: user.name, email: user.email }, token };
};
