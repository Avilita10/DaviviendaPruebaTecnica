"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = exports.taskRoutes = exports.authRoutes = void 0;
var authRoutes_1 = require("./authRoutes");
Object.defineProperty(exports, "authRoutes", { enumerable: true, get: function () { return __importDefault(authRoutes_1).default; } });
var taskRoutes_1 = require("./taskRoutes");
Object.defineProperty(exports, "taskRoutes", { enumerable: true, get: function () { return __importDefault(taskRoutes_1).default; } });
var userRoutes_1 = require("./userRoutes");
Object.defineProperty(exports, "userRoutes", { enumerable: true, get: function () { return __importDefault(userRoutes_1).default; } });
