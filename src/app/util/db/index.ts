import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Environment from './../../../environment';

export class Database {
  supabase: SupabaseClient;
  
  constructor() {
		this.supabase = createClient(
      Environment.SupabaseUrl ?? 'https://pzgvduxvjtlasvadxqmg.supabase.co',
      Environment.SupabaseKey ?? '',
    )
	}
}

export class Singleton {
  private static instance: Database;

  private constructor() {}
  
  public static getInstance(): Database {
    if (!Singleton.instance) {
      Singleton.instance = new Database()
    }        
    return Singleton.instance
  }
}
