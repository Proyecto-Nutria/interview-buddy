import Logger from './app/util/logger';
import ENVIRONMENT from './ENVIRONMENT';
import { Client as DiscordClient, Guild, TextChannel } from 'discord.js';
import { adaptMessage, DiscordMessageType, handleMessage } from './app/messages';
import Constants from './constants';

const db_handler = require('./app/util/db/guild.db');
const isProd = ENVIRONMENT.PLAYGROUND === 'production';
const DISCORD_CLIENT: DiscordClient = new DiscordClient({
    presence: {
        activity: {
            name: `${Constants.Prefix}help`,
            type: 'LISTENING',
        },
    },
});


if (!ENVIRONMENT.BOT_TOKEN) throw new Error('Unable to locate Discord token');

DISCORD_CLIENT.login(ENVIRONMENT.BOT_TOKEN)
.then(() => Logger.info('nutria-bot is now running!'))
.catch(Logger.error);

DISCORD_CLIENT.on('ready', () => {
    console.log(`Logged in as ${DISCORD_CLIENT.user?.tag}!`);
    if(ENVIRONMENT.DISC_USER) DISCORD_CLIENT.users.fetch(ENVIRONMENT.DISC_USER).then(user => user.send('Hola, estoy vivo!')).catch(console.error);
});

DISCORD_CLIENT.on('guildCreate', async (guild: Guild) => {
    db_handler.setGuild(guild.id);
});

DISCORD_CLIENT.on('message', async (message: DiscordMessageType) => {
    const isBotCommandEvent = !message.author.bot && (message.content[0] === Constants.Prefix);
    const events = [];

    if (isBotCommandEvent) {
        const channelName = (message.channel as TextChannel).name;
        const payload = adaptMessage(message, channelName);
        events.push(handleMessage(payload));
    }

    await Promise.all(events);
});

DISCORD_CLIENT.on( "error", 
    e =>  Logger.error("Discord client error!", e) 
);