import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, './../.env') });

const Environment = {
  BotToken: process.env.BOT_TOKEN,
  Playground: process.env.NODE_ENV,
  SupabaseUrl: process.env.SUPABASE_URL,
  SupabaseKey: process.env.SUPABASE_KEY,
  MailUser: process.env.MAIL_USER,
  MailPass: process.env.MAIL_PASS,
  AdminRole: process.env.ADMIN_ROLE,
};

export default Environment;
