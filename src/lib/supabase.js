// Name: Natalie Kanyuchi
// Student ID number: 23198994
// Description: supabase configuration file
//creates and exports the supabase client instance
//used to connect react application to the backened database
import { createClient} from "@supabase/supabase-js";
//supabase project URL
const supabaseUrl="https://kyvhotzqnuuyntbzjkqp.supabase.co";
//supabase public client key
const supabaseAnonKey="sb_publishable_9LUIMyHgasO4u60g09IO8g_Lff20WPB";

//export supabase client for use in other files.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);