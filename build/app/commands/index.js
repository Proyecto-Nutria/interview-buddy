"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const echo_command_1 = __importDefault(require("./echo.command"));
const help_command_1 = __importDefault(require("./help.command"));
const subscribe_command_1 = __importDefault(require("./subscribe.command"));
const interview_match_command_1 = __importDefault(require("./interview_match.command"));
exports.default = {
    echo: echo_command_1.default,
    help: help_command_1.default,
    subscribe: subscribe_command_1.default,
    interview_match: interview_match_command_1.default,
};
