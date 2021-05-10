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
async function run() {
    const isProd = environment_1.default.Playground === 'production';
    const userRole = new Map();
    if (!environment_1.default.BotToken) {
        throw new Error('Unable to locate Discord token');
    }
    exports.discordClient = discordClient = new discord_js_1.Client({
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
        if (environment_1.default.WelcomeChannel === '' || !discordClient.channels.cache.get(environment_1.default.WelcomeChannel)?.isText)
            return;
        const channel = discordClient.channels.cache.get(environment_1.default.WelcomeChannel);
        environment_1.default.WelcomeMessages.map(welcome_message => {
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
                const user_role = guild.roles.cache.find(r => r.name === environment_1.default.UserRole);
                if (user_role) {
                    logger_1.default.info(`Role ${user_role.name}:${user_role.id} added to guild ${guild.name}:${guild.id}`);
                    userRole.set(data_guild.guild_id, user_role);
                }
                else
                    logger_1.default.error('Not user role present');
            });
        });
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
