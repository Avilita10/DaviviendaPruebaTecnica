import pool from '../config/db';

export type UserRecord = {
  id?: number;
  name: string;
  email: string;
  password_hash: string;
  created_at?: Date;
  updated_at?: Date;
};

export const createUser = async (user: UserRecord) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *`,
    [user.name, user.email, user.password_hash]
  );
  return result.rows[0];
};

export const getUserByEmail = async (email: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  return result.rows[0];
};

export const getUserById = async (id: number) => {
  const result = await pool.query(`SELECT id, name, email, created_at FROM users WHERE id = $1`, [id]);
  return result.rows[0];
};

export const getAllUsers = async () => {
  const result = await pool.query(`SELECT id, name, email, created_at FROM users ORDER BY created_at DESC`);
  return result.rows;
};

export const updateUser = async (id: number, patch: Partial<UserRecord>) => {
  const fields: string[] = [];
  const params: any[] = [];
  let idx = 1;
  for (const key of Object.keys(patch)) {
    fields.push(`${key} = $${idx++}`);
    // @ts-ignore
    params.push((patch as any)[key]);
  }
  if (fields.length === 0) {
    const res = await pool.query(`SELECT id, name, email, created_at FROM users WHERE id = $1`, [id]);
    return res.rows[0];
  }
  params.push(id);
  const q = `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING id, name, email, created_at`;
  const res = await pool.query(q, params);
  return res.rows[0];
};

export const deleteUser = async (id: number) => {
  await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  return true;
};
