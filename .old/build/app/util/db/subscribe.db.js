"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const logger_1 = __importDefault(require("./../logger"));
class SubscribeHandler {
    constructor() {
        this.database = _1.Singleton.getInstance();
    }
    async getEmail(user_id, guild_id) {
        try {
            return await this.database.supabase
                .from('user_handle')
                .select('email')
                .eq('user_id', user_id)
                .eq('guild_id', guild_id)
                .limit(1);
        }
        catch (error) {
            logger_1.default.error(error);
        }
    }
    async setEmail(user_id, guild_id, email) {
        try {
            await this.database.supabase
                .from('user_handle')
                .insert([
                { user_id: user_id, guild_id: guild_id, email: email },
            ], { upsert: true });
        }
        catch (error) {
            logger_1.default.error(error);
        }
    }
}
module.exports = new SubscribeHandler();
