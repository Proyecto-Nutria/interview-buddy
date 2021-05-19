"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.discordClient = exports.Bot = void 0;
const logger_1 = __importDefault(require("./util/logger"));
const environment_1 = __importDefault(require("./../environment"));
const discord_js_1 = require("discord.js");
const messages_1 = require("./messages");
const constants_1 = __importDefault(require("./../constants"));
const db_handler = require('./util/db/guild.db');
let discordClient;
exports.discordClient = discordClient;
const intents = new discord_js_1.Intents(discord_js_1.Intents.NON_PRIVILEGED);
intents.add('GUILD_MEMBERS');
async function run() {
    const isProd = environment_1.default.Playground === 'production';
    const userRole = new Map();
    if (!environment_1.default.BotToken) {
        throw new Error('Unable to locate Discord token');
    }
    exports.discordClient = discordClient = new discord_js_1.Client({
        ws: { intents: intents },
        presence: {
            activity: {
                name: `${constants_1.default.Prefix}help`,
                type: 'LISTENING',
            },
        },
    });
    discordClient
        .login(environment_1.default.BotToken)
        .then(() => logger_1.default.info('nutria-bot is now running!'))
        .catch(logger_1.default.error);
    discordClient.on('ready', async () => {
        const guild = discordClient.guilds.cache.get(environment_1.default.Server);
        const channels = guild?.channels.cache.filter(value => value.type == "text").map(value => value);
        const references = {};
        guild?.members.fetch().then(membersFetched => {
            const members = membersFetched.map(value => ({ id: value.user.id, name: value.user.username }));
            members?.forEach(value => references[value.id] = { name: value.name, messages: 0, reactions: 0 });
            channels?.forEach(async (channel) => {
                if (channel.id !== '796600473339035660') {
                    let last_id;
                    while (true) {
                        const options = { limit: 100 };
                        if (last_id) {
                            options.before = last_id;
                        }
                        const messages = await channel.messages.fetch(options);
                        /* @ts-ignore */
                        messages?.forEach(async (message) => {
                            /* @ts-ignore */
                            message.reactions.cache.forEach(reaction => reaction.users.fetch().then(users => users.forEach(user => {
                                if (references.hasOwnProperty(user.id)) {
                                    references[user.id].reactions += 1;
                                }
                                else {
                                    logger_1.default.info(`Error with ${user.name} - ${user.id}`);
                                }
                            })));
                        });
                        /* @ts-ignore */
                        members?.forEach(member => { references[member.id].messages += messages.filter(m => m.author.id === member.id).size; });
                        /* @ts-ignore */
                        if (messages.size !== 100) {
                            break;
                        }
                    }
                }
            });
        });
        const delay = (ms) => new Promise(res => setTimeout(res, ms));
        await delay(300000);
        logger_1.default.info(references);
        logger_1.default.info(Object.values(references).filter(ref => ref.messages > 0 || ref.reactions > 0));
        logger_1.default.info(Object.values(references).filter(ref => ref.messages > 0 || ref.reactions > 0).length);
        logger_1.default.info(references['481270533506465803'].messages);
        logger_1.default.info(references['481270533506465803'].reactions);
        /* members?.forEach(value => Logger.info(value.user.username)); */
    });
    discordClient.on('guildCreate', async (guild) => {
        logger_1.default.info(`Guild ${guild.name} added`);
        db_handler.setGuild(guild.id);
        const user_role = guild.roles.cache.find(r => r.name === environment_1.default.UserRole);
        if (user_role) {
            logger_1.default.info(`Role ${user_role.name}:${user_role.id} added to guild ${guild.name}:${guild.id}`);
            userRole.set(guild.id, user_role);
        }
        else
            logger_1.default.error('Not user role present');
    });
    discordClient.on('message', async (message) => {
        const isBotCommandEvent = !message.author.bot && message.content[0] === constants_1.default.Prefix;
        const events = [];
        if (isBotCommandEvent) {
            const channelName = message.channel.name;
            const payload = messages_1.adaptMessage(message, channelName);
            events.push(messages_1.handleMessage(payload));
        }
        await Promise.all(events);
    });
    discordClient.on('messageReactionAdd', (reaction, user) => {
        const user_role = userRole.get(reaction.message.guild?.id ?? "");
        if (!user_role)
            return;
        if (user.partial) {
            user.fetch()
                .then(fullUser => {
                if (fullUser && !fullUser.bot && reaction.message.channel.isText)
                    reaction.message.guild?.member(fullUser)?.roles.add(user_role).catch(logger_1.default.error);
            })
                .catch(error => {
                console.log('Something went wrong when fetching the user: ', error);
            });
        }
        else {
            if (user && !user.bot && reaction.message.channel.isText)
                reaction.message.guild?.member(user)?.roles.add(user_role).catch(logger_1.default.error);
        }
    });
    discordClient.on("error", e => {
        logger_1.default.error("Discord client error!", e);
    });
}
const Bot = { run };
exports.Bot = Bot;
