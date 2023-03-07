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
Object.defineProperty(exports, "__esModule", { value: true });
const handlingPriority_1 = require("./handlingPriority");
function default_1(messegesHandlers) {
    return __awaiter(this, void 0, void 0, function* () {
        const generalHandlers = messegesHandlers["*"];
        const messegesHandling = {};
        delete messegesHandlers["*"];
        for (let messegeType in messegesHandlers) {
            let handlers = messegesHandlers[messegeType];
            handlers = handlers.concat(generalHandlers);
            handlers = handlers.sort(handler => { var _a; return (_a = handler.priority) !== null && _a !== void 0 ? _a : handlingPriority_1.HandlingPriority.Handeling; });
            messegesHandling[messegeType] = (messege, result, mediator) => handlers.reduce((prevFunc, nextFunc) => () => nextFunc(messege, result, prevFunc, mediator), undefined);
        }
        return messegesHandling;
    });
}
exports.default = default_1;
;
