import { Message } from "discord.js";
import { DBHandler } from "../DBHandler";

export const SubscribeCommand = (message:Message, args:Array<string> = null) =>
{
    DBHandler
        .getInstance()
        .setMail({ id: message.author.id, mail: args[0] })
        .then((result) => {
            message.reply(
                `Hey ${message.author.username} your command was successfully executed`
            );
        })
        .catch(console.error);
}