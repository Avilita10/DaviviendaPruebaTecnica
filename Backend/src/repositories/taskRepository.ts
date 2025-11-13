import pool from '../config/db';

export type TaskRecord = {
  id?: number;
  user_id: number;
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
};

export const createTask = async (task: TaskRecord) => {
  const result = await pool.query(
    `INSERT INTO tasks (user_id, title, description, priority, status) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [task.user_id, task.title, task.description, task.priority || 'medium', task.status || 'pending']
  );
  return result.rows[0];
};

export const getTasksByUser = async (userId: number, filters: {status?: string; priority?: string}) => {
  // Try to exclude soft-deleted rows (state = 0). If the 'state' column doesn't exist
  // the query will fail — in that case fallback to a query without the state condition.
  const baseConditions = ['user_id = $1'];
  const baseParams: any[] = [userId];
  let idxBase = 2;
  if (filters.status) { baseConditions.push(`status = $${idxBase++}`); baseParams.push(filters.status); }
  if (filters.priority) { baseConditions.push(`priority = $${idxBase++}`); baseParams.push(filters.priority); }

  // First attempt: include state check
  try {
    const conditions = baseConditions.concat(['(state IS NULL OR state <> 0)']);
    const params = baseParams.slice();
    const q = `SELECT * FROM tasks WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`;
    const res = await pool.query(q, params);
    return res.rows;
  } catch (err) {
    // If the DB does not have 'state' column, fallback to query without it
    const q = `SELECT * FROM tasks WHERE ${baseConditions.join(' AND ')} ORDER BY created_at DESC`;
    const res = await pool.query(q, baseParams);
    return res.rows;
  }
};

export const getTaskById = async (id: number) => {
  const res = await pool.query(`SELECT * FROM tasks WHERE id = $1`, [id]);
  return res.rows[0];
};

export const getAllTasks = async () => {
  try {
    const q = `SELECT * FROM tasks WHERE (state IS NULL OR state <> 0) ORDER BY created_at DESC`;
    const res = await pool.query(q, []);
    return res.rows;
  } catch (err) {
    const q = `SELECT * FROM tasks ORDER BY created_at DESC`;
    const res = await pool.query(q, []);
    return res.rows;
  }
};

export const updateTask = async (id: number, patch: Partial<TaskRecord>) => {
  const fields: string[] = [];
  const params: any[] = [];
  let idx = 1;
  for (const key of Object.keys(patch)) {
    fields.push(`${key} = $${idx++}`);
    // @ts-ignore
    params.push((patch as any)[key]);
  }
  if (fields.length === 0) {
    const res = await pool.query(`SELECT * FROM tasks WHERE id = $1`, [id]);
    return res.rows[0];
  }
  params.push(id);
  const q = `UPDATE tasks SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING *`;
  const res = await pool.query(q, params);
  return res.rows[0];
};

export const deleteTask = async (id: number) => {
  // Try to perform a soft-delete by setting state = 0 if the column exists.
  try {
    await pool.query(`UPDATE tasks SET state = 0, updated_at = NOW() WHERE id = $1`, [id]);
    return true;
  } catch (err) {
    // If the update fails (e.g., no 'state' column), fallback to hard delete
    await pool.query(`DELETE FROM tasks WHERE id = $1`, [id]);
    return true;
  }
};
