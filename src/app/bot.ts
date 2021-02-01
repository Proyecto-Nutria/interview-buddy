import Logger from './util/logger';
import Environment from './../environment';
import { Client as DiscordClient, Guild, TextChannel } from 'discord.js';
import { adaptMessage, DiscordMessageType, handleMessage } from './messages';
import Constants from './../constants';

const db_handler = require('./util/db/guild.db');
let discordClient: DiscordClient;

async function run() {
  const isProd = Environment.Playground === 'production';

  if (!Environment.BotToken) {
    throw new Error('Unable to locate Discord token');
  }

  discordClient = new DiscordClient({
    presence: {
      activity: {
        name: `${Constants.Prefix}help`,
        type: 'LISTENING',
      },
    },
  });

  discordClient
    .login(Environment.BotToken)
    .then(() => Logger.info('nutria-bot is now running!'))
    .catch(Logger.error);

  discordClient.on('guildCreate', async (guild: Guild) => {
    db_handler.setGuild(guild.id);
  });

  discordClient.on('message', async (message: DiscordMessageType) => {
    const isBotCommandEvent =
      !message.author.bot && message.content[0] === Constants.Prefix;
    const events = [];

    if (isBotCommandEvent) {
      const channelName = (message.channel as TextChannel).name;
      const payload = adaptMessage(message, channelName);
      events.push(handleMessage(payload));
    }

    await Promise.all(events);
  });

  discordClient.on(
    "error", 
    e => { Logger.error("Discord client error!", e); 
  });
}

const Bot = { run };

export { Bot, discordClient };
