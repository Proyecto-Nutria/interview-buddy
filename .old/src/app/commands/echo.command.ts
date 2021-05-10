import { MessagePayloadType } from './../messages';
import Constants from './../../constants';
import Logger from '../util/logger';
import { errorCommandText } from './../util/auxiliary';
import { resolve } from 'node:path';

const email_service = require('./../util/mail')

/** Usage documentation. */
const options: Array<Object> = [
  {
    name: `\`<text>\``,
    value: 'Reply with the \`text\` wrote',
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
export default async function echo(payload: MessagePayloadType) {
  if (payload.args[0] === 'help') {
    await payload.source.member?.send({embed:help(payload.command)});
  } else if (payload.args === undefined || payload.args.length === 0) {
    await payload.source.reply(errorCommandText(payload.command));
  }else {
    await payload.source.reply(payload.args.join(' '));
  }
}