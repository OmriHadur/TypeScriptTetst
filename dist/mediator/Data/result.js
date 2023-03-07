"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Result {
    constructor() {
        this.isFailed = () => this.errors.length > 0;
        this.isSuccess = () => this.errors.length == 0 && this.value != null;
        this.errors = [];
    }
}
exports.default = Result;
