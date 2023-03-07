"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs = __importStar(require("fs"));
const dictionary_1 = __importDefault(require("./Data/dictionary"));
function default_1(handlersFolder, requireFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const messegesHandlers = new dictionary_1.default();
        yield addFiles(messegesHandlers, handlersFolder, requireFolder);
        return messegesHandlers;
    });
}
exports.default = default_1;
;
const addFiles = (messegesHandlers, filesFolder, requireFolder) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const files = fs.readdirSync(filesFolder);
    for (let fileName of files) {
        if (fileName.endsWith(".js")) {
            const handlerInstance = yield GetInstance(requireFolder, fileName);
            const messegeType = (_a = handlerInstance.messegeType) !== null && _a !== void 0 ? _a : "*";
            messegesHandlers[messegeType] = (_b = messegesHandlers[messegeType]) !== null && _b !== void 0 ? _b : [];
            messegesHandlers[messegeType].push(handlerInstance.handle);
        }
        else
            addFiles(messegesHandlers, filesFolder + fileName, requireFolder + fileName + "/");
    }
    ;
    function GetInstance(requireFolder, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const handlerFile = yield (_a = requireFolder + fileName, Promise.resolve().then(() => __importStar(require(_a))));
            return new handlerFile.default();
        });
    }
});
