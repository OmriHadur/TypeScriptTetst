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
const result_1 = __importDefault(require("./Data/result"));
class Mediator {
    constructor(handlers) {
        this.handlers = handlers;
    }
    send(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const typeName = request.constructor.name;
            const handler = this.handlers[typeName];
            const result = new result_1.default();
            const handleFunctin = handler(request, result, this);
            yield handleFunctin();
            return result;
        });
    }
}
exports.default = Mediator;
