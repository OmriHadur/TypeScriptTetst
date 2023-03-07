"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandlingPriority = void 0;
var HandlingPriority;
(function (HandlingPriority) {
    HandlingPriority[HandlingPriority["PreHandling"] = 0] = "PreHandling";
    HandlingPriority[HandlingPriority["Authentication"] = 1] = "Authentication";
    HandlingPriority[HandlingPriority["Validation"] = 2] = "Validation";
    HandlingPriority[HandlingPriority["Handeling"] = 3] = "Handeling";
    HandlingPriority[HandlingPriority["PostHandeling"] = 4] = "PostHandeling";
})(HandlingPriority = exports.HandlingPriority || (exports.HandlingPriority = {}));
