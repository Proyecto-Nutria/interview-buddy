const { HelpCommand } = require('./CommandsImplementation/help.js');
const { SubscribeCommand } = require('./CommandsImplementation/subscribe.js');
module.exports.COMMANDS =
    {
        help: HelpCommand,
        subscribe: SubscribeCommand
    };
