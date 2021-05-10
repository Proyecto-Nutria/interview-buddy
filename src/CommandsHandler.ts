const { COMMANDS } = require ('./commandsWrapper.js');

module.exports.CommandsHandler = class CommandsHandler 
{
	private bot: Object;
	private static instance: CommandsHandler;

	private constructor(bot: Object) 
    {
		this.bot = bot;
	}

	public execute(command:string, message, args:Array<string> = null)
    {
        COMMANDS[command](message, args);
    };

	public static getInstance(bot: Object = null): CommandsHandler 
    {
		if (!CommandsHandler.instance)
			CommandsHandler.instance = new CommandsHandler(bot);
		return CommandsHandler.instance;
	}
}
