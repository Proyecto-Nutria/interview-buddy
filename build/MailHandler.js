const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NUTRI_MAIL,
        pass: process.env.NUTRI_PASS
    }
});
let mailOptions = {
    from: process.env.NUTRI_MAIL,
    to: '',
    subject: '',
    text: ''
};
module.exports.MailHandler = class MailHandler {
    constructor() { }
    sendMail({ to, subject, text }) {
        mailOptions.to = to;
        mailOptions.subject = subject;
        mailOptions.text = text;
        transporter.sendMail(mailOptions, (error, info) => (error ? console.error(error) : null));
    }
    ;
    static getInstance() {
        if (!MailHandler.instance)
            MailHandler.instance = new MailHandler();
        return MailHandler.instance;
    }
    ;
};
