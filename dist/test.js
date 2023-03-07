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
const mediator_1 = __importDefault(require("./mediator/mediator"));
const testMessege_1 = __importDefault(require("./messeges/testMessege"));
const getMessegesHandling_1 = __importDefault(require("./mediator/getMessegesHandling"));
const getMessegesHandlers_1 = __importDefault(require("./mediator/getMessegesHandlers"));
const testUnitMessege_1 = __importDefault(require("./messeges/testUnitMessege"));
const filesFolder = './dist/handlers';
const requireFolder = '../handlers/';
const a = () => __awaiter(void 0, void 0, void 0, function* () {
    const messegesHandlers = yield (0, getMessegesHandlers_1.default)(filesFolder, requireFolder);
    const handlers = yield (0, getMessegesHandling_1.default)(messegesHandlers);
    const messege = new testMessege_1.default("name", 1);
    const mediator = new mediator_1.default(handlers);
    const result = yield mediator.send(messege);
    const result2 = yield mediator.send(new testUnitMessege_1.default);
    console.log(result.isSuccess());
    console.log(result2.isSuccess());
});
a();
