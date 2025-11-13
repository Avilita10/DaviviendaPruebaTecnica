import bcrypt from 'bcrypt';
import * as userRepo from '../repositories/userRepository';

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export const getAllUsers = async () => {
  return await userRepo.getAllUsers();
};

export const getUser = async (id: number) => {
  return await userRepo.getUserById(id);
};

export const updateUser = async (id: number, patch: any) => {
  // validate fields
  if (patch.name !== undefined && (!patch.name || patch.name.length < 2)) throw new Error('Entrada inválida: name');
  if (patch.email !== undefined && !EMAIL_REGEX.test(patch.email)) throw new Error('Entrada inválida: email');
  if (patch.password !== undefined && !PASSWORD_REGEX.test(patch.password)) throw new Error('Entrada inválida: password');

  // if email provided, check uniqueness
  if (patch.email) {
    const existing = await userRepo.getUserByEmail(patch.email);
    if (existing && existing.id !== id) throw new Error('El correo ya está registrado');
  }

  const clean: any = {};
  if (patch.name !== undefined) clean.name = patch.name;
  if (patch.email !== undefined) clean.email = patch.email;
  if (patch.password !== undefined) {
    const hash = await bcrypt.hash(patch.password, 10);
    clean.password_hash = hash;
  }

  return await userRepo.updateUser(id, clean);
};

export const deleteUser = async (id: number) => {
  return await userRepo.deleteUser(id);
};
