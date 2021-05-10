const HelpCommandRes = 
{
    title: 'Interview Buddy Manual',
    description: 'Hi Otter, this are the commands you can use with me:',
    fields: 
    [
        {
            name: '\>help',
            value: 'Show all possible commands you can use',
        },
        {
            name: '\>subscribe @mail',
            value: 'Subscribe to mail service',
        }
    ],
};

module.exports.HelpCommand = (message, args:Array<string> = null) => 
{
    message.reply({ embed: HelpCommandRes });
}