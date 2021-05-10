import { MessagePayloadType, DiscordMessageType } from './../messages';
import Constants from './../../constants';
import Logger from './../util/logger';
import { isAdmin, isValidChannel, createMatchImage, errorCommandText } from './../util/auxiliary';
import { TextChannel, User } from 'discord.js';
import { discordClient } from './../bot';

const schedule = require('node-schedule');
const db_mail_handler = require('./../util/db/subscribe.db');
const email_service = require('./../util/mail');

let sendWeekMessageJob: any | undefined = undefined;
const getEmojiMessage = `You have 15s to react to this message with the emoji that you want to use (by default is 👍).`;

const interviewBuddyMessage = (emoji: string) => `Hello my beloved otters, it is time to practice! 
React to this message with ${emoji} if you want to make a mock interview with another otter.
Remeber you only have 24 hours to react. A nice week to all of you and keep coding!`;

const getSendWeekMessageJob = (channel: TextChannel, emoji: string, day: number) => schedule.scheduleJob(`0 12 * * ${day}`, () => {
  channel.send(interviewBuddyMessage(emoji)).then(updateWeekMessage.bind(null, emoji, channel)).catch(console.error);
});

async function getEmojiReaction(user_id: string, message: DiscordMessageType) {
  const emoji_array = await message.awaitReactions(
    (reactions: any, user: User) => user.id === user_id, 
    { time: 15000 }
  ).then(collected => collected.array().map(element => element.emoji.name)).catch(Logger.error);
  return (emoji_array && emoji_array.length > 0) ? emoji_array[0] : '👍';
} 

async function updateWeekMessage(emoji: string, channel: TextChannel, message: DiscordMessageType) {
  const weekOtterPool = Array<{id: string, username: string}>();
  await message.awaitReactions(
    (reaction: any) => reaction.emoji.name === emoji, 
    { time: 15000 }
  ).then(collected => {
    collected.each(user =>{
      user.users.cache.each(user => weekOtterPool.push({id: user.id, username: `${user.username}#${user.discriminator}`}));
    });
  }).catch(Logger.error);
  createMatchImage(makePairs(weekOtterPool, channel)).on('finish', (result: any) => {
    Logger.info(result);
    Logger.info(__dirname);
    channel.send('These are the pairs of the week.\nPlease get in touch with your partner!', { files:['./src/app/util/img/weekPairs.png'] })
  });
}

function makePairs(weekOtterPool: Array<{id: string, username: string}>, channel: TextChannel) {
  const weekOtterPairs = Array<{otterOne: string, otterTwo: string}>()
  while(weekOtterPool.length > 0) {
    if(weekOtterPool.length === 1) weekOtterPool.push({id: '481270533506465803', username: 'Akotadi#5688'});
    const first_index = Math.floor(Math.random() * weekOtterPool.length);
    const otterOne: {id: string, username: string} = weekOtterPool[first_index];
    weekOtterPool.splice(first_index, 1);
    
    const second_index = Math.floor(Math.random() * weekOtterPool.length);
    const otterTwo: {id: string, username: string} = weekOtterPool[second_index];
    weekOtterPool.splice(second_index, 1);
    
    discordClient.users.fetch(otterOne.id).then(async user => user.send(await sendPairMessage(otterOne, otterTwo, channel))).catch(Logger.error);
    discordClient.users.fetch(otterTwo.id).then(async user => user.send(await sendPairMessage(otterTwo, otterOne, channel))).catch(Logger.error);
    weekOtterPairs.push({otterOne: otterOne.username, otterTwo: otterTwo.username});
  }
  return weekOtterPairs;
}

async function sendPairMessage(user: {id: string, username: string}, match: {id: string, username: string}, channel: TextChannel) {
    const message_content = `Hello ${user.username}!\nYou have been paired with ${match.username}. Please get in contact with she/he!.\n*Have fun!*`;
    db_mail_handler.getEmail(user.id, channel.guild.id).then(async (result: any) => {
      const { body } = result || {};
      Logger.info(body);
      if(body && body.length === 1) {
        const { email } = body[0];
        await email_service.sendMail(
          email, 
          'Interview Buddy', 
          message_content,
        ).then((msg: any) => { 
          Logger.info(`Echo sendMail result: ${msg}`); 
        }).catch(Logger.error);
      }
    });
    return message_content;
}

/** Usage documentation. */
const options: Array<Object> = [
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

const help = (commandPrefix: string): Object => {
  return {
    color: Constants.BrandColor,
    title: Constants.Prefix + commandPrefix,
    description: '**Options:**',
    fields: options,
    footer: footer,
  };
};

/** Execute the command. */
export default async function echo(payload: MessagePayloadType) {
  	if (!isAdmin(payload.source)) {
    	payload.source.reply(`You're not allowed to execute this command.`);
  	} else if (payload.args[0] === 'help') {
    	await payload.source.member?.send({embed:help(payload.command)});
  	} else if (payload.args === undefined || payload.args.length === 0) {
    	await payload.source.reply(errorCommandText(payload.command));
  	}else {
		const arg = payload.args[0];
		if (arg === "start" && payload.args.length > 1) {
		sendWeekMessageJob?.cancel();
		const channel_text = payload.args[1];
		const channel = isValidChannel(channel_text) ? 
			payload.source.guild?.channels.cache.get(channel_text.replace(/\D/g,''))
			: undefined;
		const day = payload.args.length === 3 ? parseInt(payload.args[2], 10) as number : 2 as number;
		const user = payload.source.author.id;

		if(!(channel?.isText) || isNaN(day) || 0 > day || day > 7) {
			return;
		}
		const emoji = await payload.source.reply(getEmojiMessage).then(getEmojiReaction.bind(null, user));
		sendWeekMessageJob = getSendWeekMessageJob(channel as TextChannel, emoji, day);
		} else if (arg === "stop" && sendWeekMessageJob) {
		sendWeekMessageJob.cancel();
		sendWeekMessageJob = undefined;
		payload.source.reply("The `interview_match` activity is stopped now!");
		}
  }
}