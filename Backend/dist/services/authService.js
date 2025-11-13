"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository_1 = require("../repositories/userRepository");
const dotenv_1 = __importDefault(require("dotenv"));
const validation_1 = require("../utils/validation");
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const register = async (name, email, password) => {
    const errors = (0, validation_1.validateRegister)({ name, email, password });
    if (errors.length)
        throw new Error('Entrada inválida: ' + errors.join(','));
    const existing = await (0, userRepository_1.getUserByEmail)(email);
    if (existing)
        throw new Error('El correo ya está registrado');
    const hash = await bcrypt_1.default.hash(password, 10);
    const user = await (0, userRepository_1.createUser)({ name, email, password_hash: hash });
    const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '1h' });
    return { user: { id: user.id, name: user.name, email: user.email }, token };
};
exports.register = register;
const login = async (email, password) => {
    const user = await (0, userRepository_1.getUserByEmail)(email);
    if (!user)
        throw new Error('Credenciales inválidas');
    const ok = await bcrypt_1.default.compare(password, user.password_hash);
    if (!ok)
        throw new Error('Credenciales inválidas');
    const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '1h' });
    return { user: { id: user.id, name: user.name, email: user.email }, token };
};
exports.login = login;
