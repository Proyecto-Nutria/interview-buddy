const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(
{
	service: 'gmail',
	auth: {
		user: process.env.NUTRI_MAIL,
		pass: process.env.NUTRI_PASS
	}
});

let mailOptions = 
{
	from: process.env.NUTRI_MAIL,
  	to: '',
	subject: '',
  	text: ''
};

module.exports.MailHandler = class MailHandler 
{
    private static instance: MailHandler;
    private constructor() { }
    public sendMail({to, subject, text}): void
    {
        mailOptions.to = to;
        mailOptions.subject = subject;
        mailOptions.text = text;
        transporter.sendMail(mailOptions, (error, info) => (error? console.error(error):null));
    };
    public static getInstance(): MailHandler 
    {
        if (!MailHandler.instance)
            MailHandler.instance = new MailHandler();
        return MailHandler.instance;
    };
}