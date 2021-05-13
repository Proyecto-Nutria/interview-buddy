import HelpCommand from './CommandsImplementation/HelpCommand/help';
import SubscribeCommand from './CommandsImplementation/SubscribeCommand/subscribe';
import BuddyInterviewCommand from './CommandsImplementation/BuddyInterviewCommand/buddy'
export default
{
	help: HelpCommand,
    subscribe: SubscribeCommand,
    buddy: BuddyInterviewCommand.getInstance().executeCommand
};
