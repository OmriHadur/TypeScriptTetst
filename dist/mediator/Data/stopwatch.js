"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Stopwatch {
    constructor() {
        this.startTime = new Date();
    }
    restart() {
        this.startTime = new Date();
    }
    stop() {
        if (!this.startTime) {
            throw new Error('Stopwatch has not been started');
        }
        const stopTime = new Date();
        const elapsedTime = stopTime.getTime() - this.startTime.getTime();
        this.startTime = null;
        return elapsedTime;
    }
}
exports.default = Stopwatch;
