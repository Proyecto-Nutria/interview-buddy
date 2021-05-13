"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuddyHandler = void 0;
const messages_1 = require("../messages");
const textToImage_1 = require("./textToImage");
const schedule = require("node-schedule");
let weekOtterPool = [];
let weekOtterPairs = [];
let weekMessageJob;
class BuddyHandler {
    constructor(client) {
        this.client = client;
    }
    updateWeekMessage(message) {
        let weekMessage = message;
        weekMessage
            .awaitReactions(filter, { time: 330000 })
            .then((collected) => {
            collected.each(user => {
                user.users.cache.each(pushToOtterPool);
                makePairs().then(res => {
                    textToImage_1.default(weekOtterPairs).on('finish', () => {
                        let BuddyChannel = client.channels.cache.get(channel);
                        BuddyChannel.send('These are the pairs of the week.\nPlease get in touch with your partner!', { files: ['./weekPairs.png'] });
                    });
                });
            });
        })
            .catch(console.error);
    }
    startWeekMessageJob({ hour = '12', day = '0-6' }) {
        weekMessageJob = schedule.scheduleJob('0 ' + hour + ' * * ' + day, () => {
            weekOtterPool = [];
            weekOtterPairs = [];
            let BuddyChannel = client.channels.cache.get(channel);
            BuddyChannel.send(messages_1.default.Interview_Buddy_Message)
                .then(updateWeekMessage)
                .catch(console.error);
        });
    }
}
exports.BuddyHandler = BuddyHandler;
