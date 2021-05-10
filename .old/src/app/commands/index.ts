import { MessagePayloadType } from './../messages';
import echo from './echo.command';
import help from './help.command';
import subscribe from './subscribe.command';
import interview_match from './interview_match.command';

type CommandsType = {
  echo: (payload: MessagePayloadType) => Promise<void>;
  help: (payload: MessagePayloadType) => Promise<void>;
  subscribe: (payload: MessagePayloadType) => Promise<void>;
  interview_match: (payload: MessagePayloadType) => Promise<void>;
};

export default {
  echo,
  help,
  subscribe,
  interview_match,
} as CommandsType;
