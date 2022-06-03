"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = void 0;
const mongoose_1 = require("mongoose");
// Database connection handeling right here
(0, mongoose_1.connect)(`${process.env.MONGO_DB}`)
    .then((con) => console.log("connection successful to the database"))
    .catch((err) => console.log("failed to connect to the database", err));
exports.name = "hi there";
//# sourceMappingURL=database.js.map