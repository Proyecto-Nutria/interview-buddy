import Logger from './util/logger';
import Environment from './../environment';
import { Client as DiscordClient, Guild, Role, TextChannel, User } from 'discord.js';
import { adaptMessage, DiscordMessageType, handleMessage } from './messages';
import Constants from './../constants';

const db_handler = require('./util/db/guild.db');
let discordClient: DiscordClient;

async function run() {
  const isProd = Environment.Playground === 'production';
  const userRole = new Map<string, Role>();

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

  discordClient.on('ready', async () => {
    if(Environment.WelcomeChannel === '' || !discordClient.channels.cache.get(Environment.WelcomeChannel)?.isText) return;
    const channel = discordClient.channels.cache.get(Environment.WelcomeChannel) as TextChannel;
    Environment.WelcomeMessages.map(welcome_message => {
      channel.messages.fetch(welcome_message).then(m => {
        console.log(`Cached reaction message ${welcome_message}`);
      }).catch(e => {
        console.error("Error loading message", e);
      });
    });

    db_handler.getGuilds().then(({ data }: {data: Array<{ [key: string]: string}>}) => {
      data.map(data_guild => {
        const guild = discordClient.guilds.cache.get(data_guild.guild_id);
        if(!guild) return;
        const user_role = guild.roles.cache.find(r => r.name === Environment.UserRole);
        if(user_role) {
          Logger.info(`Role ${user_role.name}:${user_role.id} added to guild ${guild.name}:${guild.id}`);
          userRole.set(data_guild.guild_id, user_role);
        }
        else Logger.error('Not user role present');
      });
    });
  });

  discordClient.on('guildCreate', async (guild: Guild) => {
    Logger.info(`Guild ${guild.name} added`);
    db_handler.setGuild(guild.id);
    const user_role = guild.roles.cache.find(r => r.name === Environment.UserRole);
    if(user_role) {
      Logger.info(`Role ${user_role.name}:${user_role.id} added to guild ${guild.name}:${guild.id}`);
      userRole.set(guild.id, user_role);
    }
    else Logger.error('Not user role present');
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

  discordClient.on('messageReactionAdd', (reaction, user) => {
    const user_role = userRole.get(reaction.message.guild?.id ?? "");
    if(!user_role) return;
    if(user.partial) {
      user.fetch()
      .then(fullUser => {
        if (fullUser && !fullUser.bot && reaction.message.channel.isText)
          reaction.message.guild?.member(fullUser)?.roles.add(user_role).catch(Logger.error);
      })
      .catch(error => {
        console.log('Something went wrong when fetching the user: ', error);
      });
    } else {
      if (user && !user.bot && reaction.message.channel.isText)
        reaction.message.guild?.member(user)?.roles.add(user_role).catch(Logger.error);
    }
  });

  discordClient.on(
    "error", 
    e => { Logger.error("Discord client error!", e); 
  });
}

const Bot = { run };

export { Bot, discordClient };
