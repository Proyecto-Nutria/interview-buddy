require('dotenv').config();
import CommandsHandler from './CommandsHandler';
import { Message, Client, TextChannel } from "discord.js";
import BuddyInterviewCommand from './CommandsImplementation/BuddyInterviewCommand/buddy'

const client = new Client();
const CommandsHandlerInstance = CommandsHandler.getInstance();

const prefix = '>';

let BuddyChannel;

client.login(process.env.BOT_TOKEN)
	.then(res =>
		{
			BuddyInterviewCommand.getInstance(client);
		})
	.catch(err => console.error(err));

client.on('ready', () => 
{
	console.log(`Logged in as ${client.user.tag}!`);
	client.users
		.fetch(process.env.MASTER)
		.then((user) => user.send('Hola. ¡Estoy vivo!'))
		.catch(console.error);
});

client.on('message', message => 
{
	if (message.content.startsWith(prefix)) commandResolution(message);
});


function commandResolution(message:Message) 
{
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	CommandsHandlerInstance.execute(command, message, args);
}

