import { MessagePayloadType } from './../messages';
import Constants from './../../constants';
import { isAdmin } from './../util/auxiliary';
import Logger from '../util/logger';

const commands = [
  {
    name: `\`${Constants.Prefix}help\``,
    value: 'Show all possible commands you can use (via dm)',
  },
  {
    name: `\`${Constants.Prefix}echo\``,
    value: 'Reply with your text',
  },
  {
    name: `\`${Constants.Prefix}subscribe\``,
    value: 'Receive our notifications by email',
  },
];

const admin_commands = [
  {
    name: `\`${Constants.Prefix}interview_match\``,
    value: 'Set the interview activity',
  },
];

const footer = {
  text: `Type \'${Constants.Prefix}<command> help\' for specific info about how to use them.`,
};

const helpText = {
  color: Constants.BrandColor,
  title: 'Interview Buddy Manual',
  description: 'Hi Otter, this are the commands that you can use with me:',
  fields: commands,
  footer: footer,
};

/** Execute the command. */
export default async function help(payload: MessagePayloadType) {
  if (isAdmin(payload.source)) {
    helpText.fields = commands.concat(admin_commands);
  }
  await payload.source.member?.send({embed:helpText});
}