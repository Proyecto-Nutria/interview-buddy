"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_1 = __importDefault(require("./../util/logger"));
const auxiliary_1 = require("./../util/auxiliary");
const constants_1 = __importDefault(require("./../../constants"));
const db_handler = require('./../util/db/subscribe.db');
/** Usage documentation. */
const options = [
    {
        name: `\`<email>\``,
        value: 'Subscribe to our notifications via email.',
    },
];
const help = (commandPrefix) => {
    return {
        color: constants_1.default.BrandColor,
        title: constants_1.default.Prefix + commandPrefix,
        description: '**Options:**',
        fields: options,
    };
};
/** Execute the command. */
async function subscribe(payload) {
    if (payload.args[0] === 'help') {
        await payload.source.member?.send({ embed: help(payload.command) });
    }
    else if (payload.args === undefined
        || payload.args.length !== 1
        || !auxiliary_1.isValidEmail(payload.args[0])) {
        await payload.source.reply(auxiliary_1.errorCommandText(payload.command));
    }
    else {
        const user_id = payload.source.author.id;
        const guild_id = payload.source.channel instanceof discord_js_1.TextChannel
            ? payload.source.channel.guild.id
            : '742890088190574634';
        const email = payload.args[0];
        db_handler.setEmail(user_id, guild_id, email)
            .then((result) => {
            logger_1.default.info(`Data updated: ${result}`);
            payload.source.reply(`Hey ${payload.source.author.username} you're now subscribed with ${email}!`);
        })
            .catch((e) => logger_1.default.error("Subscribe setEmail error!", e));
    }
}
exports.default = subscribe;
