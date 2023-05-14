"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByToken = exports.checkToken = exports.updateUser = exports.findUserById = exports.checkEmailExist = exports.addUser = void 0;
const addUser = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)";
exports.addUser = addUser;
const checkEmailExist = "SELECT * FROM users WHERE email = $1";
exports.checkEmailExist = checkEmailExist;
const findUserById = "SELECT * FROM users WHERE id = $1";
exports.findUserById = findUserById;
const checkToken = "SELECT * FROM users WHERE accesstoken = $1";
exports.checkToken = checkToken;
const updateUser = "UPDATE users SET accesstoken = $2, refreshtoken = $3 WHERE id = $1";
exports.updateUser = updateUser;
const findUserByToken = "SELECT * FROM users WHERE refreshtoken = $1";
exports.findUserByToken = findUserByToken;
//# sourceMappingURL=queries.js.map