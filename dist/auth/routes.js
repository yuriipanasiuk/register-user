"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const validation_1 = __importDefault(require("../auth/validation"));
const validateField_1 = __importDefault(require("../auth/validateField"));
const validateToken_1 = __importDefault(require("../auth/validateToken"));
const auth_1 = __importDefault(require("./auth"));
const router = (0, express_1.Router)();
router.post("/register", (0, validation_1.default)(validateField_1.default), controller_1.singUp);
router.post("/login", (0, validation_1.default)(validateField_1.default), controller_1.logIn);
router.post("/logout", auth_1.default, controller_1.logOut);
router.post("/refresh", (0, validation_1.default)(validateToken_1.default), controller_1.refresh);
router.get("/current", auth_1.default, controller_1.getCurrent);
exports.default = router;
//# sourceMappingURL=routes.js.map