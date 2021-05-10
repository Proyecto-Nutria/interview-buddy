var _a, _b, _c, _d, _e, _f;
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, './../.env') });
const Environment = {
    BotToken: process.env.BOT_TOKEN,
    Playground: (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : 'development',
    SupabaseUrl: process.env.SUPABASE_URL,
    SupabaseKey: process.env.SUPABASE_KEY,
    MailUser: process.env.MAIL_USER,
    MailPass: process.env.MAIL_PASS,
    UserRole: (_b = process.env.USER_ROLE) !== null && _b !== void 0 ? _b : 'User',
    AdminRole: (_c = process.env.ADMIN_ROLE) !== null && _c !== void 0 ? _c : 'Admin',
    WelcomeChannel: (_d = process.env.WELCOME_CHANNEL) !== null && _d !== void 0 ? _d : '',
    WelcomeMessages: (_f = (_e = process.env.WELCOME_MESSAGES) === null || _e === void 0 ? void 0 : _e.split(',')) !== null && _f !== void 0 ? _f : [],
};
export default Environment;
