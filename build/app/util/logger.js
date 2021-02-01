"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function info(...args) {
    console.log(...args);
}
function debug(...args) {
    console.log(...args);
}
function error(...args) {
    console.error(...args);
}
function warn(...args) {
    console.warn(...args);
}
const Logger = {
    info,
    debug,
    error,
    warn,
};
exports.default = Logger;
