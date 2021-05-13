"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commandsWrapper_1 = require("./commandsWrapper");
class CommandsHandler {
    constructor(bot) {
        this.bot = bot;
    }
    execute(command, message, args = null) {
        commandsWrapper_1.default[command](message, args);
    }
    ;
    static getInstance(bot = null) {
        if (!CommandsHandler.instance)
            CommandsHandler.instance = new CommandsHandler(bot);
        return CommandsHandler.instance;
    }
}
exports.default = CommandsHandler;
