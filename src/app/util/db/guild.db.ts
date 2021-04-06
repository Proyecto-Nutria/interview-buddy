import { Snowflake } from 'discord.js';
import { Database, Singleton } from '.';
import Logger from './../logger';

class GuildHandler {
  database: Database;

	constructor() {
		this.database = Singleton.getInstance();
  }

	async getGuilds() {
    try {
      return await this.database.supabase
        .from('guild_handle')
        .select('*')
    } catch(error) {
      Logger.error(error);
    }
  }

	async getGuild(guild_id: Snowflake) {
    try {
      return await this.database.supabase
        .from('guild_handle')
        .select('*')
        .eq('guild_id', guild_id)
    } catch(error) {
      Logger.error(error);
    }
  }

	async setGuild(guild_id: string) {
    try {
      await this.database.supabase
        .from('guild_handle')
        .insert(
          [
            { guild_id: guild_id},
          ],
          { upsert: true }
        )
    } catch(error) {
      Logger.error(error);
    }
  }
}

module.exports = new GuildHandler();