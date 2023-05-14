"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const queries_1 = require("./queries");
const { ACCESS_SECRET_KEY } = process.env;
const auth = (req, _res, next) => {
    try {
        const { authorization = "" } = req.headers;
        const [type, token] = authorization.split(" ");
        if (type !== "Bearer") {
            return next((0, http_errors_1.default)(401, "Not autorized"));
        }
        const payload = (ACCESS_SECRET_KEY === null || ACCESS_SECRET_KEY === void 0 ? void 0 : ACCESS_SECRET_KEY.length) && jsonwebtoken_1.default.verify(token, ACCESS_SECRET_KEY);
        db_1.default.query(queries_1.findUserById, [payload.id], (error, result) => {
            if (error)
                throw error;
            if (!result.rows.length) {
                return next((0, http_errors_1.default)(401, "Not autorized"));
            }
            db_1.default.query(queries_1.checkToken, [token], (error, result) => {
                if (error)
                    throw error;
                if (!result.rows.length) {
                    return next((0, http_errors_1.default)(401, "Not autorized"));
                }
                req.user = result.rows[0];
                next();
            });
        });
    }
    catch (error) {
        if (error.message === "invalid signature") {
            return next((0, http_errors_1.default)(401, "Not autorized"));
        }
        next(error);
    }
};
exports.default = auth;
//# sourceMappingURL=auth.js.map