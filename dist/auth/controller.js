"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = exports.getCurrent = exports.logOut = exports.logIn = exports.singUp = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const queries_1 = require("./queries");
const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;
const singUp = (req, res, next) => {
    const { name, email, password } = req.body;
    db_1.default.query(queries_1.checkEmailExist, [email], (error, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (error)
            throw error;
        const isEmailExist = result.rows.length;
        if (isEmailExist) {
            return next((0, http_errors_1.default)(409, "Email in use"));
        }
        const hashPassword = yield bcryptjs_1.default.hash(password, 10);
        db_1.default.query(queries_1.addUser, [name, email, hashPassword], (error, _result) => {
            if (error)
                throw error;
            res.status(201).json({
                user: {
                    name,
                    email,
                    hashPassword,
                },
            });
        });
    }));
};
exports.singUp = singUp;
const logIn = (req, res, next) => {
    const { email, password } = req.body;
    db_1.default.query(queries_1.checkEmailExist, [email], (error, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (error)
            throw error;
        const user = result.rows;
        if (!user[0]) {
            return next((0, http_errors_1.default)(401, "Email or password is wrong"));
        }
        const comparePassword = yield bcryptjs_1.default.compare(password, user[0].password);
        if (!comparePassword) {
            return next((0, http_errors_1.default)(401, "Email or password is wrong"));
        }
        const payload = {
            id: user[0].id,
        };
        const accessToken = (ACCESS_SECRET_KEY === null || ACCESS_SECRET_KEY === void 0 ? void 0 : ACCESS_SECRET_KEY.length) &&
            jsonwebtoken_1.default.sign(payload, ACCESS_SECRET_KEY, {
                expiresIn: "7h",
            });
        const refreshToken = (REFRESH_SECRET_KEY === null || REFRESH_SECRET_KEY === void 0 ? void 0 : REFRESH_SECRET_KEY.length) &&
            jsonwebtoken_1.default.sign(payload, REFRESH_SECRET_KEY, {
                expiresIn: "7h",
            });
        db_1.default.query(queries_1.findUserById, [user[0].id], (error, _result) => {
            if (error)
                throw error;
            db_1.default.query(queries_1.updateUser, [user[0].id, accessToken, refreshToken], (error, _result) => {
                if (error)
                    throw error;
            });
            res.json({
                accessToken,
                refreshToken,
            });
        });
    }));
};
exports.logIn = logIn;
const logOut = (req, res, _next) => {
    const { id } = req.user || {};
    console.log(id);
    db_1.default.query(queries_1.updateUser, [id, null, null], (error, _result) => {
        if (error)
            throw error;
    });
    res.json({ message: "user logged out" });
};
exports.logOut = logOut;
const getCurrent = (req, res, _next) => {
    const { name, email } = req.user || {};
    res.json({
        user: {
            name,
            email,
        },
    });
};
exports.getCurrent = getCurrent;
const refresh = (req, res, next) => {
    const { refreshToken: token } = req.body;
    try {
        const verify = (REFRESH_SECRET_KEY === null || REFRESH_SECRET_KEY === void 0 ? void 0 : REFRESH_SECRET_KEY.length) && jsonwebtoken_1.default.verify(token, REFRESH_SECRET_KEY);
        db_1.default.query(queries_1.findUserByToken, [token], (error, result) => {
            if (error)
                throw error;
            if (!result.rows.length) {
                return next((0, http_errors_1.default)(403, "Token is invalid"));
            }
            const payload = {
                id: verify.id,
            };
            const accessToken = (ACCESS_SECRET_KEY === null || ACCESS_SECRET_KEY === void 0 ? void 0 : ACCESS_SECRET_KEY.length) &&
                jsonwebtoken_1.default.sign(payload, ACCESS_SECRET_KEY, {
                    expiresIn: "7h",
                });
            const refreshToken = (REFRESH_SECRET_KEY === null || REFRESH_SECRET_KEY === void 0 ? void 0 : REFRESH_SECRET_KEY.length) &&
                jsonwebtoken_1.default.sign(payload, REFRESH_SECRET_KEY, {
                    expiresIn: "7h",
                });
            res.json({
                accessToken,
                refreshToken,
            });
        });
    }
    catch (error) {
        next(error);
    }
};
exports.refresh = refresh;
//# sourceMappingURL=controller.js.map