"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
dotenv_1.default.config();
require("./config/database");
app.get("/", (req, res) => {
    res.send("this is a test route");
});
app.listen(5000, () => {
    console.log("listening on port 5000");
});
//# sourceMappingURL=server.js.map