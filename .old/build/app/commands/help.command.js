"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = __importDefault(require("./../../constants"));
const auxiliary_1 = require("./../util/auxiliary");
const commands = [
    {
        name: `\`${constants_1.default.Prefix}help\``,
        value: 'Show all possible commands you can use (via dm)',
    },
    {
        name: `\`${constants_1.default.Prefix}echo\``,
        value: 'Reply with your text',
    },
    {
        name: `\`${constants_1.default.Prefix}subscribe\``,
        value: 'Receive our notifications by email',
    },
];
const admin_commands = [
    {
        name: `\`${constants_1.default.Prefix}interview_match\``,
        value: 'Set the interview activity',
    },
];
const footer = {
    text: `Type \'${constants_1.default.Prefix}<command> help\' for specific info about how to use them.`,
};
const helpText = {
    color: constants_1.default.BrandColor,
    title: 'Interview Buddy Manual',
    description: 'Hi Otter, this are the commands that you can use with me:',
    fields: commands,
    footer: footer,
};
/** Execute the command. */
async function help(payload) {
    if (auxiliary_1.isAdmin(payload.source)) {
        helpText.fields = commands.concat(admin_commands);
    }
    await payload.source.member?.send({ embed: helpText });
}
exports.default = help;
