
import MESSAGES from '../../messages';
import DBHandler from '../../DBHandler';
import * as schedule from 'node-schedule';
import MailHandler from '../../MailHandler';
import textToImage from '../../AuxiliaryFunctions/textToImage';
import { Message, Client, TextChannel } from "discord.js";

const MailHandlerInstance = MailHandler.getInstance();
const channel = process.env.CHANNEL;
const options: Object = 
{
	title: 'Interview Buddy Manual',
	description: 'Hi Otter, this are the commands you can use with me:',
	fields: 
	[
		{
			name: '\>buddy start [day]',
			value: 'Start the interview activity at 12:00pm choosing the channel and a day of the week (in number between 0-6 where 0 is Sunday), by default is each Tuesday.',
		},
		{
			name: '\>stop',
			value: 'If any activity started, stop it.',
		}
	],
};

export default class BuddyHandler
{
	
	private client: Client;
	private static instance: BuddyHandler;
	private filter = reaction => reaction.emoji.name === '👍';
	private weekOtterPool:Array<Object> = [];
	private weekOtterPairs:Array<Object> = [];
	private weekMessageJob:schedule.Job;
	private BuddyChannel:TextChannel;

	private constructor(client: Client)
	{
		this.client = client;
	}

	private startWeekMessageJob({hour = '12', day = '2'})
	{
		this.weekMessageJob = schedule.scheduleJob('0 ' + hour + ' * * ' + day, () => 
		{
			this.weekOtterPool = [];
			this.weekOtterPairs = [];
			this.BuddyChannel = this.client.channels.cache.get(channel) as TextChannel;
			this.BuddyChannel.send(MESSAGES.Interview_Buddy_Message)
				.then(this.updateWeekMessage)
				.catch(console.error);
		});
	}

	private updateWeekMessage(message: Message) 
	{
		let weekMessage = message;
		weekMessage
			.awaitReactions(this.filter, { time: 330000 })
			.then(collected => {
				collected.each(user => 
				{
					user.users.cache.each( this.pushToOtterPool );
					this.makePairs().then( res =>
					{
						textToImage(this.weekOtterPairs).on('finish', () => 
						{
							let BuddyChannel = this.client.channels.cache.get(channel) as TextChannel;
							BuddyChannel.send(
									'These are the pairs of the week.\nPlease get in touch with your partner!',
									{ files: ['./weekPairs.png'] }
								);
						})
					});
				});
			})
			.catch(console.error);
	}

	private pushToOtterPool(user)
	{
		this.weekOtterPool.push(
		{
			id: user.id,
			name: user.username,
			discriminator: user.discriminator,
		})
	}

	private makePairs() 
	{
		return new Promise(async (resolve, reject) => 
		{
			while (this.weekOtterPool.length > 0) 
			{
				if (this.weekOtterPool.length === 1)
					this.weekOtterPool.push(
					{
						id: process.env.ANDRES_ID,
						name: process.env.ANDRES_NAME,
						discriminator: process.env.ANDRES_DESC
					});
				let OtterOne, OtterTwo, index;
				index = Math.floor(Math.random() * this.weekOtterPool.length);
				OtterOne = this.weekOtterPool[index];
				this.weekOtterPool.splice(index, 1);

				index = Math.floor(Math.random() * this.weekOtterPool.length);
				OtterTwo = this.weekOtterPool[index];
				this.weekOtterPool.splice(index, 1);

				await this.client.users
					.fetch(OtterOne.id)
					.then(user => user.send(this.pairMessageMaker(OtterOne, OtterTwo)))
					.catch(console.error);
				await this.client.users
					.fetch(OtterTwo.id)
					.then(user => user.send(this.pairMessageMaker(OtterTwo, OtterOne)))
					.catch(console.error);
				this.weekOtterPairs.push({ otterOne: OtterOne, otterTwo: OtterTwo });
			}
			resolve(true);
		});
	}
	pairMessageMaker(to, pair) 
	{
		DBHandler.getInstance().getMail(to).then(result => {
			if (result)
				MailHandlerInstance.sendMail({
					to: result.mail,
					subject: 'Interview Buddy',
					text: MESSAGES.Pair_Make_Msg(to, pair)
				});
		});
		return MESSAGES.Pair_Make_Msg(to, pair);
	}

	public executeCommand(message:Message, args:Array<string> = null)
	{
		switch (args[0]) {
			case 'start':
				/**TODO Add formatting if day and hour are passed as parameters */
				this.startWeekMessageJob({day: args[1]?args[1]:'2'});
				message.reply('Job started');
				break;
			case 'stop':
				if(this.weekMessageJob) this.weekMessageJob.cancel();
				message.reply('Job stopped');
				break;
			case 'options':
				message.reply({embed:options})
			default:
				break;
		}
	}

	public static getInstance(client: Client = null): BuddyHandler 
    {
        if (!BuddyHandler.instance)
			BuddyHandler.instance = new BuddyHandler(client);
        return BuddyHandler.instance;
    };
}
