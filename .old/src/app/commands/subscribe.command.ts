import { MessagePayloadType } from './../messages';
import { TextChannel } from 'discord.js';
import Logger from './../util/logger';
import { isValidEmail, errorCommandText } from './../util/auxiliary';
import Constants from './../../constants';

const db_handler = require('./../util/db/subscribe.db');

/** Usage documentation. */
const options: Array<Object> = [
  {
    name: `\`<email>\``,
    value: 'Subscribe to our notifications via email.',
  },
];

const help = (commandPrefix: string): Object => {
  return {
    color: Constants.BrandColor,
    title: Constants.Prefix + commandPrefix,
    description: '**Options:**',
    fields: options,
  };
};

/** Execute the command. */
export default async function subscribe(payload: MessagePayloadType) {
  if (payload.args[0] === 'help') {
    await payload.source.member?.send({embed:help(payload.command)});
  } else if (payload.args === undefined 
    || payload.args.length !== 1
    || !isValidEmail(payload.args[0])) {
    await payload.source.reply(errorCommandText(payload.command));
  }else {
    const user_id = payload.source.author.id;
    const guild_id = 
      payload.source.channel instanceof TextChannel 
        ? payload.source.channel.guild.id 
        : '742890088190574634';
    const email = payload.args[0];

    db_handler.setEmail(user_id, guild_id, email)
      .then((result: any) => {
        Logger.info(`Data updated: ${result}`)
          payload.source.reply(`Hey ${payload.source.author.username} you're now subscribed with ${email}!`);
      })
      .catch((e: any) => Logger.error("Subscribe setEmail error!", e));
  }
}