const { COMMANDS } = require('./commandsWrapper.js');
module.exports.CommandsHandler = class CommandsHandler {
    constructor(bot) {
        this.bot = bot;
    }
    execute(command, message, args = null) {
        COMMANDS[command](message, args);
    }
    ;
    static getInstance(bot = null) {
        if (!CommandsHandler.instance)
            CommandsHandler.instance = new CommandsHandler(bot);
        return CommandsHandler.instance;
    }
};
