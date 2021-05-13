"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const CommandsHandler_1 = require("./CommandsHandler");
const discord_js_1 = require("discord.js");
const buddy_1 = require("./CommandsImplementation/BuddyInterviewCommand/buddy");
const client = new discord_js_1.Client();
const CommandsHandlerInstance = CommandsHandler_1.default.getInstance();
const prefix = '>';
let BuddyChannel;
client.login(process.env.BOT_TOKEN)
    .then(res => {
    buddy_1.default.getInstance(client);
})
    .catch(err => console.error(err));
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.users
        .fetch(process.env.MASTER)
        .then((user) => user.send('Hola. ¡Estoy vivo!'))
        .catch(console.error);
});
client.on('message', message => {
    if (message.content.startsWith(prefix))
        commandResolution(message);
});
function commandResolution(message) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    CommandsHandlerInstance.execute(command, message, args);
}
