"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const authMiddleware = (req, res, next) => {
    const auth = req.get && req.get('authorization');
    if (!auth)
        return res.status(401).json({ error: 'No se proporcionó token' });
    const parts = auth.split(' ');
    if (parts.length !== 2)
        return res.status(401).json({ error: 'Token inválido' });
    const token = parts[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.userId = payload.id;
        next();
    }
    catch (err) {
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
};
exports.default = authMiddleware;
