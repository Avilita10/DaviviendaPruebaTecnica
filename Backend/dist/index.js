"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = require("./routes");
const healthController_1 = require("./controllers/healthController");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/auth', routes_1.authRoutes);
app.use('/tasks', routes_1.taskRoutes);
app.get('/health', healthController_1.ping);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
