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
    discordClient.on('guildCreate', async (guild) => {
        db_handler.setGuild(guild.id);
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
    discordClient.on("error", e => {
        logger_1.default.error("Discord client error!", e);
    });
}
const Bot = { run };
exports.Bot = Bot;
