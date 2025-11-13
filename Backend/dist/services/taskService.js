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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTask = exports.listTasks = exports.createTask = void 0;
const taskRepo = __importStar(require("../repositories/taskRepository"));
const validation_1 = require("../utils/validation");
const createTask = async (userId, payload) => {
    const errors = (0, validation_1.validateTask)(payload);
    if (errors.length)
        throw new Error('Entrada inválida: ' + errors.join(','));
    return await taskRepo.createTask({ user_id: userId, title: payload.title, description: payload.description, priority: payload.priority, status: payload.status });
};
exports.createTask = createTask;
const listTasks = async (userId, filters) => {
    return await taskRepo.getTasksByUser(userId, filters);
};
exports.listTasks = listTasks;
const getTask = async (id) => {
    return await taskRepo.getTaskById(id);
};
exports.getTask = getTask;
const updateTask = async (id, patch) => {
    // Allowable fields only
    const allowed = ['title', 'description', 'priority', 'status'];
    const clean = {};
    for (const k of Object.keys(patch))
        if (allowed.includes(k))
            clean[k] = patch[k];
    const errors = (0, validation_1.validateTask)(clean, true);
    if (errors.length)
        throw new Error('Entrada inválida: ' + errors.join(','));
    return await taskRepo.updateTask(id, clean);
};
exports.updateTask = updateTask;
const deleteTask = async (id) => {
    return await taskRepo.deleteTask(id);
};
exports.deleteTask = deleteTask;
