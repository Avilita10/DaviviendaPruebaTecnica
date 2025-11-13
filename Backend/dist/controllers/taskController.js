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
const taskService = __importStar(require("../services/taskService"));
const createTask = async (req, res) => {
    try {
        const userId = req.userId;
        const task = await taskService.createTask(userId, req.body);
        res.status(201).json(task);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.createTask = createTask;
const listTasks = async (req, res) => {
    try {
        const userId = req.userId;
        const { status, priority } = req.query;
        const tasks = await taskService.listTasks(userId, { status, priority });
        res.json(tasks);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.listTasks = listTasks;
const getTask = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const task = await taskService.getTask(id);
        if (!task)
            return res.status(404).json({ error: 'No encontrado' });
        res.json(task);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.getTask = getTask;
const updateTask = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const patch = req.body;
        const task = await taskService.updateTask(id, patch);
        res.json(task);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await taskService.deleteTask(id);
        res.json({ success: true, message: 'Eliminado correctamente' });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.deleteTask = deleteTask;
