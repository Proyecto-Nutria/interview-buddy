"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const path_1 = require("path");
dotenv_1.config({ path: path_1.resolve(__dirname, './../.env') });
const Environment = {
    BotToken: process.env.BOT_TOKEN,
    Playground: process.env.NODE_ENV,
    SupabaseUrl: process.env.SUPABASE_URL,
    SupabaseKey: process.env.SUPABASE_KEY,
    MailUser: process.env.MAIL_USER,
    MailPass: process.env.MAIL_PASS,
    AdminRole: process.env.ADMIN_ROLE,
};
exports.default = Environment;
