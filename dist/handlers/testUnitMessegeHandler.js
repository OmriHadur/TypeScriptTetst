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
const unit_1 = __importDefault(require("../mediator/Data/unit"));
const testUnitMessege_1 = __importDefault(require("../messeges/testUnitMessege"));
const wait = function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
class TestMessegeHandler {
    constructor() {
        this.messegeType = testUnitMessege_1.default.name;
    }
    handle(request, result, next, mediator) {
        return __awaiter(this, void 0, void 0, function* () {
            yield wait(200);
            result.value = unit_1.default.Instance;
        });
    }
}
exports.default = TestMessegeHandler;
