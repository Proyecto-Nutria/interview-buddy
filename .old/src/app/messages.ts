import { Message } from 'discord.js';
import CommandStore from './command.store';
import Logger from './util/logger';
import Constants from './../constants';

export type DiscordMessageType = Message;

export type MessagePayloadType = {
  readonly command: string;
  readonly args: string[];
  readonly source: DiscordMessageType;
  readonly channel: string;
};

export const adaptMessage = (  message: DiscordMessageType, channelName: string,): MessagePayloadType => {
  const [command, ...args] = message.content.split(' ')
  .map((token) => token.toLowerCase());

  return {
    command: command.substring(1),
    args: args,
    source: message,
    channel: channelName,
  };
};

export const handleMessage = async (payload: MessagePayloadType) => {
  const fn = CommandStore.get(payload.command);
  if (!fn) {
    await payload.source.reply(`I don't recognize that command. Try ${Constants.Prefix}help.`);
  } else if (payload.args[0] == 'help') {
    await fn(payload).catch(Logger.error);
  } else {
    await fn(payload).catch(Logger.error);
  }
};
