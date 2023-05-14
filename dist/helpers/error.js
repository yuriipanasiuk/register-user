"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MyError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}
exports.default = MyError;
//# sourceMappingURL=error.js.map