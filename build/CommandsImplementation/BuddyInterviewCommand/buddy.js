"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = require("../../messages");
const DBHandler_1 = require("../../DBHandler");
const schedule = require("node-schedule");
const MailHandler_1 = require("../../MailHandler");
const textToImage_1 = require("../../AuxiliaryFunctions/textToImage");
const MailHandlerInstance = MailHandler_1.default.getInstance();
const channel = process.env.CHANNEL;
const options = {
    title: 'Interview Buddy Manual',
    description: 'Hi Otter, this are the commands you can use with me:',
    fields: [
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
class BuddyHandler {
    constructor(client) {
        this.filter = reaction => reaction.emoji.name === '👍';
        this.weekOtterPool = [];
        this.weekOtterPairs = [];
        this.client = client;
    }
    startWeekMessageJob({ hour = '12', day = '2' }) {
        this.weekMessageJob = schedule.scheduleJob('0 ' + hour + ' * * ' + day, () => {
            this.weekOtterPool = [];
            this.weekOtterPairs = [];
            this.BuddyChannel = this.client.channels.cache.get(channel);
            this.BuddyChannel.send(messages_1.default.Interview_Buddy_Message)
                .then(this.updateWeekMessage)
                .catch(console.error);
        });
    }
    updateWeekMessage(message) {
        let weekMessage = message;
        weekMessage
            .awaitReactions(this.filter, { time: 330000 })
            .then(collected => {
            collected.each(user => {
                user.users.cache.each(this.pushToOtterPool);
                this.makePairs().then(res => {
                    textToImage_1.default(this.weekOtterPairs).on('finish', () => {
                        let BuddyChannel = this.client.channels.cache.get(channel);
                        BuddyChannel.send('These are the pairs of the week.\nPlease get in touch with your partner!', { files: ['./weekPairs.png'] });
                    });
                });
            });
        })
            .catch(console.error);
    }
    pushToOtterPool(user) {
        this.weekOtterPool.push({
            id: user.id,
            name: user.username,
            discriminator: user.discriminator,
        });
    }
    makePairs() {
        return new Promise(async (resolve, reject) => {
            while (this.weekOtterPool.length > 0) {
                if (this.weekOtterPool.length === 1)
                    this.weekOtterPool.push({
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
    pairMessageMaker(to, pair) {
        DBHandler_1.default.getInstance().getMail(to).then(result => {
            if (result)
                MailHandlerInstance.sendMail({
                    to: result.mail,
                    subject: 'Interview Buddy',
                    text: messages_1.default.Pair_Make_Msg(to, pair)
                });
        });
        return messages_1.default.Pair_Make_Msg(to, pair);
    }
    executeCommand(message, args = null) {
        switch (args[0]) {
            case 'start':
                /**TODO Add formatting if day and hour are passed as parameters */
                this.startWeekMessageJob({ day: args[1] ? args[1] : '2' });
                message.reply('Job started');
                break;
            case 'stop':
                if (this.weekMessageJob)
                    this.weekMessageJob.cancel();
                message.reply('Job stopped');
                break;
            case 'options':
                message.reply({ embed: options });
            default:
                break;
        }
    }
    static getInstance(client = null) {
        if (!BuddyHandler.instance)
            BuddyHandler.instance = new BuddyHandler(client);
        return BuddyHandler.instance;
    }
    ;
}
exports.default = BuddyHandler;
