"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getTasksByUser = exports.createTask = void 0;
const db_1 = __importDefault(require("../config/db"));
const createTask = async (task) => {
    const result = await db_1.default.query(`INSERT INTO tasks (user_id, title, description, priority, status) VALUES ($1,$2,$3,$4,$5) RETURNING *`, [task.user_id, task.title, task.description, task.priority || 'medium', task.status || 'pending']);
    return result.rows[0];
};
exports.createTask = createTask;
const getTasksByUser = async (userId, filters) => {
    // Try to exclude soft-deleted rows (state = 0). If the 'state' column doesn't exist
    // the query will fail — in that case fallback to a query without the state condition.
    const baseConditions = ['user_id = $1'];
    const baseParams = [userId];
    let idxBase = 2;
    if (filters.status) {
        baseConditions.push(`status = $${idxBase++}`);
        baseParams.push(filters.status);
    }
    if (filters.priority) {
        baseConditions.push(`priority = $${idxBase++}`);
        baseParams.push(filters.priority);
    }
    // First attempt: include state check
    try {
        const conditions = baseConditions.concat(['(state IS NULL OR state <> 0)']);
        const params = baseParams.slice();
        const q = `SELECT * FROM tasks WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`;
        const res = await db_1.default.query(q, params);
        return res.rows;
    }
    catch (err) {
        // If the DB does not have 'state' column, fallback to query without it
        const q = `SELECT * FROM tasks WHERE ${baseConditions.join(' AND ')} ORDER BY created_at DESC`;
        const res = await db_1.default.query(q, baseParams);
        return res.rows;
    }
};
exports.getTasksByUser = getTasksByUser;
const getTaskById = async (id) => {
    const res = await db_1.default.query(`SELECT * FROM tasks WHERE id = $1`, [id]);
    return res.rows[0];
};
exports.getTaskById = getTaskById;
const updateTask = async (id, patch) => {
    const fields = [];
    const params = [];
    let idx = 1;
    for (const key of Object.keys(patch)) {
        fields.push(`${key} = $${idx++}`);
        // @ts-ignore
        params.push(patch[key]);
    }
    if (fields.length === 0) {
        const res = await db_1.default.query(`SELECT * FROM tasks WHERE id = $1`, [id]);
        return res.rows[0];
    }
    params.push(id);
    const q = `UPDATE tasks SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING *`;
    const res = await db_1.default.query(q, params);
    return res.rows[0];
};
exports.updateTask = updateTask;
const deleteTask = async (id) => {
    // Try to perform a soft-delete by setting state = 0 if the column exists.
    try {
        await db_1.default.query(`UPDATE tasks SET state = 0, updated_at = NOW() WHERE id = $1`, [id]);
        return true;
    }
    catch (err) {
        // If the update fails (e.g., no 'state' column), fallback to hard delete
        await db_1.default.query(`DELETE FROM tasks WHERE id = $1`, [id]);
        return true;
    }
};
exports.deleteTask = deleteTask;
