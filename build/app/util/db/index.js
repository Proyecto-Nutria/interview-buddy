"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Singleton = exports.Database = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const environment_1 = __importDefault(require("./../../../environment"));
class Database {
    constructor() {
        this.supabase = supabase_js_1.createClient(environment_1.default.SupabaseUrl ?? 'https://pzgvduxvjtlasvadxqmg.supabase.co', environment_1.default.SupabaseKey ?? '');
    }
}
exports.Database = Database;
class Singleton {
    constructor() { }
    static getInstance() {
        if (!Singleton.instance) {
            Singleton.instance = new Database();
        }
        return Singleton.instance;
    }
}
exports.Singleton = Singleton;
