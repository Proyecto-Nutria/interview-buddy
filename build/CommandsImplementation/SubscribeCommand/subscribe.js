"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DBHandler_1 = require("../../DBHandler");
exports.default = (message, args = null) => {
    DBHandler_1.default
        .getInstance()
        .setMail({ id: message.author.id, mail: args[0] })
        .then(result => {
        message.reply(`Hey ${message.author.username} your command was successfully executed`);
    })
        .catch(console.error);
};
