const Discord = require('discord.js');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const db_handler = require('./db_handler');
const textToImage = require('./textToImage');

const client = new Discord.Client();
const prefix = '>';
const channel = "742893380995907664";//process.env.CHANNEL;
const filter = reaction => reaction.emoji.name === '👍';

const interviewBuddyMessage = `Hello my beloved otters, it is time to practice! 
React to this message with \'👍\' if you want to make a mock interview with another otter.
Remeber you only have 24 hours to react. A nice week to all of you and keep coding!`;
const helpCommand = {
    title: 'Interview Buddy Manual',
    description: 'Hi Otter, this are the commnads you can use with me:',
	fields: [
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

let weekMessage;
let weekOtterPool = [];
let weekOtterPairs = [];

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'chiefalphadog@gmail.com',
		pass: process.env.MAIL_PASS
	}
});

const sendWeekMessage = schedule.scheduleJob('46 20 * * 0-6', () => {
    weekOtterPool = [];
    weekOtterPairs = [];
    client.channels.cache.get(channel).send(interviewBuddyMessage).then(updateWeekMessage).catch(console.error);
});

let mailOptions = {
	from: 'chiefalphadog@gmail.com',
  	to: '',
	subject: '',
  	text: ''
};

client.login(process.env.BOT_KEY);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.users.fetch(process.env.DISC_USER).then(user => user.send('Hola, estoy vivo!')).catch(console.error);
});

client.on('message', message => {
    if(message.content.startsWith(prefix)) commnadResolution(message);
});

function updateWeekMessage(message){
    weekMessage = message;
    weekMessage.awaitReactions(filter, { time: 330000 })
    .then(collected => {
        collected.each(user =>{
            user.users.cache.each(user => weekOtterPool.push({id:user.id, name:user.username, discriminator:user.discriminator}));
            makePairs();
            textToImage(weekOtterPairs).on('finish', ()=>{
                client.channels.cache.get(channel).send('These are the pairs of the week.\nPlease get in touch with your partner!', {files:['./weekPairs.png']})
            })
        });
    }).catch(console.error);
} 

function commnadResolution(message){
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if(command === 'help') message.reply({embed:helpCommand});
    else if(command === 'subscribe') db_handler.setMail({id:message.author.id, mail:args[0]}).then(reult => {
        message.reply(`Hey ${message.author.username} your command was succesfully executed`);
    }).catch(console.error);
}

function makePairs() {
    while(weekOtterPool.length > 0){
        if(weekOtterPool.length === 1) weekOtterPool.push({id:'689986627753476334', name:'Andresrodart', discriminator:'4263'})
        let OtterOne, OtterTwo, index; 
        index = Math.floor(Math.random() * weekOtterPool.length);
        OtterOne = weekOtterPool[index];
        weekOtterPool.splice(index, 1);
        
        index = Math.floor(Math.random() * weekOtterPool.length);
        OtterTwo = weekOtterPool[index];
        weekOtterPool.splice(index, 1);
        
        client.users.fetch(OtterOne.id).then(user => user.send(pairMessageMaker(OtterOne, OtterTwo))).catch(console.error);
        client.users.fetch(OtterTwo.id).then(user => user.send(pairMessageMaker(OtterTwo, OtterOne))).catch(console.error);
        weekOtterPairs.push({otterOne:OtterOne, otterTwo:OtterTwo});
    }
}

function pairMessageMaker(to, wit){
    let res = `Hello ${to.name}! You have been paired with ${wit.name}#${wit.discriminator}. \nPlease get in contact with she/he!.\nHave fun!`;
    db_handler.getMail(to).then(result => {
        if(result) {
            mailOptions.to = result.mail;
            mailOptions.subject = 'Interview Buddy';
            mailOptions.text = res;
            transporter.sendMail(mailOptions, (error, info) => { if (error) console.error(error);});
        }
    });
    return res;
}
