"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const logger_1 = __importDefault(require("./../logger"));
class GuildHandler {
    constructor() {
        this.database = _1.Singleton.getInstance();
    }
    async getGuilds() {
        try {
            return await this.database.supabase
                .from('guild_handle')
                .select('*');
        }
        catch (error) {
            logger_1.default.error(error);
        }
    }
    async getGuild(guild_id) {
        try {
            return await this.database.supabase
                .from('guild_handle')
                .select('*')
                .eq('guild_id', guild_id);
        }
        catch (error) {
            logger_1.default.error(error);
        }
    }
    async setGuild(guild_id) {
        try {
            await this.database.supabase
                .from('guild_handle')
                .insert([
                { guild_id: guild_id },
            ], { upsert: true });
        }
        catch (error) {
            logger_1.default.error(error);
        }
    }
}
module.exports = new GuildHandler();
