"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HelpCommandRes = {
    title: 'Interview Buddy Manual',
    description: 'Hi Otter, this are the commands you can use with me:',
    fields: [
        {
            name: '\>help',
            value: 'Show all possible commands you can use',
        },
        {
            name: '\>subscribe @mail',
            value: 'Subscribe to mail service',
        },
        {
            name: '\>buddy [option]',
            value: 'start buddy interview activity',
        }
    ],
};
exports.default = (message, args = null) => {
    message.reply({ embed: HelpCommandRes });
};
