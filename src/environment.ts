import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, './../.env') });

const Environment = {
  BotToken: process.env.BOT_TOKEN,
  Playground: process.env.NODE_ENV ?? 'development',
  SupabaseUrl: process.env.SUPABASE_URL,
  SupabaseKey: process.env.SUPABASE_KEY,
  MailUser: process.env.MAIL_USER,
  MailPass: process.env.MAIL_PASS,
  UserRole: process.env.USER_ROLE ?? 'User',
  AdminRole: process.env.ADMIN_ROLE ?? 'Admin',
  WelcomeChannel: process.env.WELCOME_CHANNEL ?? '',
  WelcomeMessages: process.env.WELCOME_MESSAGES?.split(',') ?? [],
  Server: process.env.SERVER ?? '',
};

export default Environment;
