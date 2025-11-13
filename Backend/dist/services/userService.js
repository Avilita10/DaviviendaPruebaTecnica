"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.getAllUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userRepo = __importStar(require("../repositories/userRepository"));
const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const getAllUsers = async () => {
    return await userRepo.getAllUsers();
};
exports.getAllUsers = getAllUsers;
const getUser = async (id) => {
    return await userRepo.getUserById(id);
};
exports.getUser = getUser;
const updateUser = async (id, patch) => {
    // validate fields
    if (patch.name !== undefined && (!patch.name || patch.name.length < 2))
        throw new Error('Entrada inválida: name');
    if (patch.email !== undefined && !EMAIL_REGEX.test(patch.email))
        throw new Error('Entrada inválida: email');
    if (patch.password !== undefined && !PASSWORD_REGEX.test(patch.password))
        throw new Error('Entrada inválida: password');
    // if email provided, check uniqueness
    if (patch.email) {
        const existing = await userRepo.getUserByEmail(patch.email);
        if (existing && existing.id !== id)
            throw new Error('El correo ya está registrado');
    }
    const clean = {};
    if (patch.name !== undefined)
        clean.name = patch.name;
    if (patch.email !== undefined)
        clean.email = patch.email;
    if (patch.password !== undefined) {
        const hash = await bcrypt_1.default.hash(patch.password, 10);
        clean.password_hash = hash;
    }
    return await userRepo.updateUser(id, clean);
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    return await userRepo.deleteUser(id);
};
exports.deleteUser = deleteUser;
