import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, './../.env') });

interface Environment {
	BOT_TOKEN: string;
	PLAYGROUND: string;
	SupabaseUrl: string;
	SupabaseKey: string;
	MailUser: string;
	MailPass: string;
	AdminRole: string;
	DISC_USER: string;
};

const Environment = {
	BOT_TOKEN: process.env.BOT_TOKEN,
	PLAYGROUND: process.env.NODE_ENV,
	SupabaseUrl: process.env.SUPABASE_URL,
	SupabaseKey: process.env.SUPABASE_KEY,
	MailUser: process.env.MAIL_USER,
	MailPass: process.env.MAIL_PASS,
	AdminRole: process.env.ADMIN_ROLE,
	DISC_USER: process.env.DISC_USER
};

export default Environment;
