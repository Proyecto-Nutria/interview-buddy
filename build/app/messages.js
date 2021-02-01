"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMessage = exports.adaptMessage = void 0;
const command_store_1 = __importDefault(require("./command.store"));
const logger_1 = __importDefault(require("./util/logger"));
const constants_1 = __importDefault(require("./../constants"));
const adaptMessage = (message, channelName) => {
    const [command, ...args] = message.content
        .split(' ')
        .map((token) => token.toLowerCase());
    return {
        command: command.substring(1),
        args: args,
        source: message,
        channel: channelName,
    };
};
exports.adaptMessage = adaptMessage;
const handleMessage = async (payload) => {
    const fn = command_store_1.default.get(payload.command);
    if (!fn) {
        await payload.source.reply(`I don't recognize that command. Try ${constants_1.default.Prefix}help.`);
    }
    else if (payload.args[0] == 'help') {
        await fn(payload).catch(logger_1.default.error);
    }
    else {
        await fn(payload).catch(logger_1.default.error);
    }
};
exports.handleMessage = handleMessage;
