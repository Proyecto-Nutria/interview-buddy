import Logger from './util/logger';
import Environment from './../environment';
import { Client as DiscordClient, Guild, Role, TextChannel, User, Intents } from 'discord.js';
import { adaptMessage, DiscordMessageType, handleMessage } from './messages';
import Constants from './../constants';

const db_handler = require('./util/db/guild.db');
let discordClient: DiscordClient;
const intents = new Intents(Intents.NON_PRIVILEGED);
intents.add('GUILD_MEMBERS');

async function run() {
  const isProd = Environment.Playground === 'production';
  const userRole = new Map<string, Role>();

  if (!Environment.BotToken) {
    throw new Error('Unable to locate Discord token');
  }

  discordClient = new DiscordClient({
    ws: {intents: intents},
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
    const guild = discordClient.guilds.cache.get(Environment.Server);
    const channels = guild?.channels.cache.filter(value => value.type == "text").map(value => value as TextChannel);
    const references: {[key: string]: {name: string, messages: number, reactions: number}} = {};
    guild?.members.fetch().then(membersFetched => {
      const members = membersFetched.map(value => ({id: value.user.id, name: value.user.username}));
      members?.forEach(value => references[value.id] = {name: value.name, messages: 0, reactions: 0});
      channels?.forEach(async channel => {
        if(channel.id !== '796600473339035660') {
          let last_id;
          while(true) {
            const options: any = { limit: 100 };
            if(last_id) {
              options.before = last_id;
            }
            const messages = await channel.messages.fetch(options);
            /* @ts-ignore */
            messages?.forEach(async (message) => {
              /* @ts-ignore */
              message.reactions.cache.forEach(reaction => reaction.users.fetch().then(users => users.forEach(user => { 
                if(references.hasOwnProperty(user.id)) {
                  references[user.id].reactions += 1; 
                } else {
                  Logger.info(`Error with ${user.name} - ${user.id}`);
                }
              })));
            });
            /* @ts-ignore */
            members?.forEach(member => {references[member.id].messages += messages.filter(m => m.author.id === member.id).size});
            /* @ts-ignore */
            if(messages.size !== 100) {
              break;
            }
          }
        }
      });
    });
    const delay = (ms: any) => new Promise(res => setTimeout(res, ms));
    await delay(300000);
    Logger.info(references);
    Logger.info(Object.values(references).filter(ref => ref.messages > 0 || ref.reactions > 0));
    Logger.info(Object.values(references).filter(ref => ref.messages > 0 || ref.reactions > 0).length);
    Logger.info(references['481270533506465803'].messages);
    Logger.info(references['481270533506465803'].reactions);
    /* members?.forEach(value => Logger.info(value.user.username)); */
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
