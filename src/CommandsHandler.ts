import { Message } from 'discord.js';
import COMMANDS from './commandsWrapper';

export default class CommandsHandler 
{
	private bot: Object;
	private static instance: CommandsHandler;

	private constructor(bot: Object) 
    {
		this.bot = bot;
	}

	public execute(command:string, message:Message, args:Array<string> = null)
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
