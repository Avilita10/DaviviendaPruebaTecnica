"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.getUserById = exports.getUserByEmail = exports.createUser = void 0;
const db_1 = __importDefault(require("../config/db"));
const createUser = async (user) => {
    const result = await db_1.default.query(`INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *`, [user.name, user.email, user.password_hash]);
    return result.rows[0];
};
exports.createUser = createUser;
const getUserByEmail = async (email) => {
    const result = await db_1.default.query(`SELECT * FROM users WHERE email = $1`, [email]);
    return result.rows[0];
};
exports.getUserByEmail = getUserByEmail;
const getUserById = async (id) => {
    const result = await db_1.default.query(`SELECT id, name, email, created_at FROM users WHERE id = $1`, [id]);
    return result.rows[0];
};
exports.getUserById = getUserById;
const getAllUsers = async () => {
    const result = await db_1.default.query(`SELECT id, name, email, created_at FROM users ORDER BY created_at DESC`);
    return result.rows;
};
exports.getAllUsers = getAllUsers;
const updateUser = async (id, patch) => {
    const fields = [];
    const params = [];
    let idx = 1;
    for (const key of Object.keys(patch)) {
        fields.push(`${key} = $${idx++}`);
        // @ts-ignore
        params.push(patch[key]);
    }
    if (fields.length === 0) {
        const res = await db_1.default.query(`SELECT id, name, email, created_at FROM users WHERE id = $1`, [id]);
        return res.rows[0];
    }
    params.push(id);
    const q = `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING id, name, email, created_at`;
    const res = await db_1.default.query(q, params);
    return res.rows[0];
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    await db_1.default.query(`DELETE FROM users WHERE id = $1`, [id]);
    return true;
};
exports.deleteUser = deleteUser;
