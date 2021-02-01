import { Snowflake } from 'discord.js';
import { Database, Singleton } from '.';
import Logger from './../logger';

class SubscribeHandler {
  database: Database;

	constructor() {
		this.database = Singleton.getInstance();
  }

	async getEmail(user_id: Snowflake, guild_id: Snowflake) {
      try {
        return await this.database.supabase
          .from('user_handle')
          .select('email')
          .eq('user_id', user_id)
          .eq('guild_id', guild_id)
          .limit(1)
      } catch(error) {
        Logger.error(error);
      }
    }

	async setEmail(user_id: Snowflake, guild_id: Snowflake, email: string) {
      try {
        await this.database.supabase
          .from('user_handle')
          .insert(
            [
              { user_id: user_id, guild_id: guild_id, email: email },
            ],
            { upsert: true }
          )
      } catch(error) {
        Logger.error(error);
      }
    }
}

module.exports = new SubscribeHandler();