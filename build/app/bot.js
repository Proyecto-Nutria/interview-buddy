var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Logger from './util/logger';
import Environment from './../environment';
import { Client as DiscordClient } from 'discord.js';
import { adaptMessage, handleMessage } from './messages';
import Constants from './../constants';
const db_handler = require('./util/db/guild.db');
let discordClient;
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const isProd = Environment.Playground === 'production';
        const userRole = new Map();
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
        discordClient.on('ready', () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (Environment.WelcomeChannel === '' || !((_a = discordClient.channels.cache.get(Environment.WelcomeChannel)) === null || _a === void 0 ? void 0 : _a.isText))
                return;
            const channel = discordClient.channels.cache.get(Environment.WelcomeChannel);
            Environment.WelcomeMessages.map(welcome_message => {
                channel.messages.fetch(welcome_message).then(m => {
                    console.log(`Cached reaction message ${welcome_message}`);
                }).catch(e => {
                    console.error("Error loading message", e);
                });
            });
            db_handler.getGuilds().then(({ data }) => {
                data.map(data_guild => {
                    const guild = discordClient.guilds.cache.get(data_guild.guild_id);
                    if (!guild)
                        return;
                    const user_role = guild.roles.cache.find(r => r.name === Environment.UserRole);
                    if (user_role) {
                        Logger.info(`Role ${user_role.name}:${user_role.id} added to guild ${guild.name}:${guild.id}`);
                        userRole.set(data_guild.guild_id, user_role);
                    }
                    else
                        Logger.error('Not user role present');
                });
            });
        }));
        discordClient.on('guildCreate', (guild) => __awaiter(this, void 0, void 0, function* () {
            Logger.info(`Guild ${guild.name} added`);
            db_handler.setGuild(guild.id);
            const user_role = guild.roles.cache.find(r => r.name === Environment.UserRole);
            if (user_role) {
                Logger.info(`Role ${user_role.name}:${user_role.id} added to guild ${guild.name}:${guild.id}`);
                userRole.set(guild.id, user_role);
            }
            else
                Logger.error('Not user role present');
        }));
        discordClient.on('message', (message) => __awaiter(this, void 0, void 0, function* () {
            const isBotCommandEvent = !message.author.bot && message.content[0] === Constants.Prefix;
            const events = [];
            if (isBotCommandEvent) {
                const channelName = message.channel.name;
                const payload = adaptMessage(message, channelName);
                events.push(handleMessage(payload));
            }
            yield Promise.all(events);
        }));
        discordClient.on('messageReactionAdd', (reaction, user) => {
            var _a, _b, _c, _d;
            const user_role = userRole.get((_b = (_a = reaction.message.guild) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "");
            if (!user_role)
                return;
            if (user.partial) {
                user.fetch()
                    .then(fullUser => {
                    var _a, _b;
                    if (fullUser && !fullUser.bot && reaction.message.channel.isText)
                        (_b = (_a = reaction.message.guild) === null || _a === void 0 ? void 0 : _a.member(fullUser)) === null || _b === void 0 ? void 0 : _b.roles.add(user_role).catch(Logger.error);
                })
                    .catch(error => {
                    console.log('Something went wrong when fetching the user: ', error);
                });
            }
            else {
                if (user && !user.bot && reaction.message.channel.isText)
                    (_d = (_c = reaction.message.guild) === null || _c === void 0 ? void 0 : _c.member(user)) === null || _d === void 0 ? void 0 : _d.roles.add(user_role).catch(Logger.error);
            }
        });
        discordClient.on("error", e => {
            Logger.error("Discord client error!", e);
        });
    });
}
const Bot = { run };
export { Bot, discordClient };
