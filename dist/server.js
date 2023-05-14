"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./db"));
const { PORT } = process.env;
db_1.default
    .connect()
    .then(() => app_1.default.listen(PORT, () => {
    console.log(`Database connection successful, server port ${PORT}`);
}))
    .catch((error) => {
    console.log(error.message);
    process.exit(1);
});
//# sourceMappingURL=server.js.map