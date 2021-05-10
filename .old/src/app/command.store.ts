import { MessagePayloadType } from './messages';
import commands from './commands';

type CommandStoreType = Map<
  string,
  (payload: MessagePayloadType) => Promise<void>
>;

const CommandStore: CommandStoreType = new Map(Object.entries(commands));

export default CommandStore;
