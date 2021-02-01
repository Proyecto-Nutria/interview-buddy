"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = __importDefault(require("./../../constants"));
const logger_1 = __importDefault(require("./../util/logger"));
const auxiliary_1 = require("./../util/auxiliary");
const bot_1 = require("./../bot");
const schedule = require('node-schedule');
const db_mail_handler = require('./../util/db/subscribe.db');
const email_service = require('./../util/mail');
let sendWeekMessageJob = undefined;
const getEmojiMessage = `You have 15s to react to this message with the emoji that you want to use (by default is 👍).`;
const interviewBuddyMessage = (emoji) => `Hello my beloved otters, it is time to practice! 
React to this message with ${emoji} if you want to make a mock interview with another otter.
Remeber you only have 24 hours to react. A nice week to all of you and keep coding!`;
const getSendWeekMessageJob = (channel, emoji, day) => schedule.scheduleJob(`0 12 * * ${day}`, () => {
    channel.send(interviewBuddyMessage(emoji)).then(updateWeekMessage.bind(null, emoji, channel)).catch(console.error);
});
async function getEmojiReaction(user_id, message) {
    const emoji_array = await message.awaitReactions((reactions, user) => user.id === user_id, { time: 15000 }).then(collected => collected.array().map(element => element.emoji.name)).catch(logger_1.default.error);
    return (emoji_array && emoji_array.length > 0) ? emoji_array[0] : '👍';
}
async function updateWeekMessage(emoji, channel, message) {
    const weekOtterPool = Array();
    await message.awaitReactions((reaction) => reaction.emoji.name === emoji, { time: 15000 }).then(collected => {
        collected.each(user => {
            user.users.cache.each(user => weekOtterPool.push({ id: user.id, username: `${user.username}#${user.discriminator}` }));
        });
    }).catch(logger_1.default.error);
    auxiliary_1.createMatchImage(makePairs(weekOtterPool, channel)).on('finish', (result) => {
        logger_1.default.info(result);
        logger_1.default.info(__dirname);
        channel.send('These are the pairs of the week.\nPlease get in touch with your partner!', { files: ['./src/app/util/img/weekPairs.png'] });
    });
}
function makePairs(weekOtterPool, channel) {
    const weekOtterPairs = Array();
    while (weekOtterPool.length > 0) {
        if (weekOtterPool.length === 1)
            weekOtterPool.push({ id: '481270533506465803', username: 'Akotadi#5688' });
        const first_index = Math.floor(Math.random() * weekOtterPool.length);
        const otterOne = weekOtterPool[first_index];
        weekOtterPool.splice(first_index, 1);
        const second_index = Math.floor(Math.random() * weekOtterPool.length);
        const otterTwo = weekOtterPool[second_index];
        weekOtterPool.splice(second_index, 1);
        bot_1.discordClient.users.fetch(otterOne.id).then(async (user) => user.send(await sendPairMessage(otterOne, otterTwo, channel))).catch(logger_1.default.error);
        bot_1.discordClient.users.fetch(otterTwo.id).then(async (user) => user.send(await sendPairMessage(otterTwo, otterOne, channel))).catch(logger_1.default.error);
        weekOtterPairs.push({ otterOne: otterOne.username, otterTwo: otterTwo.username });
    }
    return weekOtterPairs;
}
async function sendPairMessage(user, match, channel) {
    const message_content = `Hello ${user.username}!\nYou have been paired with ${match.username}. Please get in contact with she/he!.\n*Have fun!*`;
    db_mail_handler.getEmail(user.id, channel.guild.id).then(async (result) => {
        const { body } = result || {};
        logger_1.default.info(body);
        if (body && body.length === 1) {
            const { email } = body[0];
            await email_service.sendMail(email, 'Interview Buddy', message_content).then((msg) => {
                logger_1.default.info(`Echo sendMail result: ${msg}`);
            }).catch(logger_1.default.error);
        }
    });
    return message_content;
}
/** Usage documentation. */
const options = [
    {
        name: `\`start <text_channel> [day_of_week]\``,
        value: 'Start the interview activity at 12:00pm choosing the channel and a day of the week (in number between 0-6 where 0 is Sunday), by default is each Tuesday.',
    },
    {
        name: `\`stop\``,
        value: 'If any activity started, stop it.',
    },
];
const footer = {
    text: `Admin command`,
};
const help = (commandPrefix) => {
    return {
        color: constants_1.default.BrandColor,
        title: constants_1.default.Prefix + commandPrefix,
        description: '**Options:**',
        fields: options,
        footer: footer,
    };
};
/** Execute the command. */
async function echo(payload) {
    if (!auxiliary_1.isAdmin(payload.source)) {
        await payload.source.reply(`You're not allowed to execute this command.`);
    }
    else if (payload.args[0] === 'help') {
        await payload.source.member?.send({ embed: help(payload.command) });
    }
    else if (payload.args === undefined || payload.args.length === 0) {
        await payload.source.reply(auxiliary_1.errorCommandText(payload.command));
    }
    else {
        const arg = payload.args[0];
        if (arg === "start" && payload.args.length > 1) {
            sendWeekMessageJob?.cancel();
            const channel_text = payload.args[1];
            const channel = auxiliary_1.isValidChannel(channel_text) ?
                payload.source.guild?.channels.cache.get(channel_text.replace(/\D/g, ''))
                : undefined;
            const day = payload.args.length === 3 ? parseInt(payload.args[2], 10) : 2;
            const user = payload.source.author.id;
            if (!(channel?.isText) || isNaN(day) || 0 > day || day > 7) {
                return;
            }
            const emoji = await payload.source.reply(getEmojiMessage).then(getEmojiReaction.bind(null, user));
            sendWeekMessageJob = getSendWeekMessageJob(channel, emoji, day);
        }
        else if (arg === "stop" && sendWeekMessageJob) {
            sendWeekMessageJob.cancel();
            sendWeekMessageJob = undefined;
            payload.source.reply("The `interview_match` activity is stopped now!");
        }
    }
}
exports.default = echo;
