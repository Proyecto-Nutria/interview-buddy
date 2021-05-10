"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = __importDefault(require("./../../constants"));
const auxiliary_1 = require("./../util/auxiliary");
const email_service = require('./../util/mail');
/** Usage documentation. */
const options = [
    {
        name: `\`<text>\``,
        value: 'Reply with the \`text\` wrote',
    },
];
const help = (commandPrefix) => {
    return {
        color: constants_1.default.BrandColor,
        title: constants_1.default.Prefix + commandPrefix,
        description: '**Options:**',
        fields: options,
    };
};
/** Execute the command. */
async function echo(payload) {
    if (payload.args[0] === 'help') {
        await payload.source.member?.send({ embed: help(payload.command) });
    }
    else if (payload.args === undefined || payload.args.length === 0) {
        await payload.source.reply(auxiliary_1.errorCommandText(payload.command));
    }
    else {
        await payload.source.reply(payload.args.join(' '));
    }
}
exports.default = echo;
