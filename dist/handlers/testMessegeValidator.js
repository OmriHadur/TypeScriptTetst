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
const handlingPriority_1 = require("../mediator/handlingPriority");
const testMessege_1 = __importDefault(require("../messeges/testMessege"));
class TestMessegeHandler {
    constructor() {
        this.messegeType = testMessege_1.default.name;
        this.priority = handlingPriority_1.HandlingPriority.Validation;
    }
    handle(request, result, next, mediator) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.number <= 0)
                result.errors.push(new Error("number is negitive"));
            if (!request.name)
                result.errors.push(new Error("name missing"));
            if (!result.isFailed())
                yield next();
        });
    }
}
exports.default = TestMessegeHandler;
