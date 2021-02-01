"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = __importStar(require("nodemailer"));
const environment_1 = __importDefault(require("./../../../environment"));
const logger_1 = __importDefault(require("./../logger"));
class GMailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: environment_1.default.MailUser,
                pass: environment_1.default.MailPass,
            }
        });
    }
    sendMail(to, subject, content) {
        const mail_options = {
            from: environment_1.default.MailUser,
            to: to,
            subject: subject,
            text: content
        };
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mail_options, (error, info) => {
                if (error) {
                    logger_1.default.error("GMailService sendMail error!", error);
                    reject(error);
                }
                else {
                    resolve(`GMailService sendMail result: ${info.response}`);
                }
            });
        });
    }
}
class Singleton {
    constructor() { }
    static getInstance() {
        if (!Singleton.instance) {
            Singleton.instance = new GMailService();
        }
        return Singleton.instance;
    }
}
module.exports = Singleton.getInstance();
