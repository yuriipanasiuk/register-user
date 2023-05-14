"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const { DB_HOST, DB_PORT, DB_PASSWORD, DB_USER, DB_NAME } = process.env;
const pool = new pg_1.Pool({
    host: DB_HOST,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    port: Number(DB_PORT),
});
exports.default = pool;
//# sourceMappingURL=db.js.map