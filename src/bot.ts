require('dotenv').config();

import { MESSAGES } from './messages';
import { MailHandler } from './MailHandler';
import { CommandsHandler } from './CommandsHandler';
import { Message } from 'discord.js';

const Discord = require('discord.js');
const schedule = require('node-schedule');
const db_handler = require('./db_handler');
const textToImage = require('./textToImage');
const client = new Discord.Client();
const MailHandlerInstance = MailHandler.getInstance();
const CommandsHandlerInstance = CommandsHandler.getInstance();

const prefix = '>';
const channel = process.env.CHANNEL;
const filter = reaction => reaction.emoji.name === '👍';

let weekMessage: Message;
let weekOtterPool:Array<Object> = [];
let weekOtterPairs:Array<Object> = [];

const sendWeekMessage = schedule.scheduleJob('46 20 * * 0-6', () => 
{
	weekOtterPool = [];
	weekOtterPairs = [];
	client.channels.cache
		.get(channel)
		.send(MESSAGES.Interview_Buddy_Message)
		.then(updateWeekMessage)
		.catch(console.error);
});

client.login(process.env.BOT_KEY);

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

function updateWeekMessage(message:Message) 
{
	weekMessage = message;
	weekMessage
		.awaitReactions(filter, { time: 330000 })
		.then((collected) => {
			collected.each(user => 
            {
				user.users.cache.each( pushToOtterPool );
				makePairs();
				textToImage(weekOtterPairs).on('finish', () => 
                {
					client.channels.cache
						.get(channel)
						.send(
							'These are the pairs of the week.\nPlease get in touch with your partner!',
							{ files: ['./weekPairs.png'] }
						);
				});
			});
		})
		.catch(console.error);
}

function commandResolution(message) 
{
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	CommandsHandlerInstance.execute(command, message, args);
}

function makePairs() 
{
	return new Promise((resolve, reject) => 
    {
        while (weekOtterPool.length > 0) 
        {
            if (weekOtterPool.length === 1)
                weekOtterPool.push({
                    id: '689986627753476334',
                    name: 'Andresrodart',
                    discriminator: '4263',
                });
            let OtterOne, OtterTwo, index;
            index = Math.floor(Math.random() * weekOtterPool.length);
            OtterOne = weekOtterPool[index];
            weekOtterPool.splice(index, 1);

            index = Math.floor(Math.random() * weekOtterPool.length);
            OtterTwo = weekOtterPool[index];
            weekOtterPool.splice(index, 1);

            client.users
                .fetch(OtterOne.id)
                .then((user) => user.send(pairMessageMaker(OtterOne, OtterTwo)))
                .catch(console.error);
            client.users
                .fetch(OtterTwo.id)
                .then((user) => user.send(pairMessageMaker(OtterTwo, OtterOne)))
                .catch(console.error);
            weekOtterPairs.push({ otterOne: OtterOne, otterTwo: OtterTwo });
        }
        // Llamamos a resolve(...) cuando lo que estabamos haciendo finaliza con éxito, y reject(...) cuando falla.
        // En este ejemplo, usamos setTimeout(...) para simular código asíncrono.
        // En la vida real, probablemente uses algo como XHR o una API HTML5.
        setTimeout(function(){
          resolve("¡Éxito!"); // ¡Todo salió bien!
        }, 250);
    });
}

function pairMessageMaker(to, pair) 
{
	db_handler.getMail(to).then((result) => {
		if (result)
			MailHandlerInstance.sendMail({
				to: result.mail,
				subject: 'Interview Buddy',
				text: MESSAGES.Pair_Make_Msg(to, pair),
			});
	});
}

function pushToOtterPool(user)
{
    weekOtterPool.push(
    {
        id: user.id,
        name: user.username,
        discriminator: user.discriminator,
    })
}