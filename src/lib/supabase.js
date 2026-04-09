// Name: Natalie Kanyuchi
// Student ID number: 23198994
// Description: supabase configuration file
//creates and exports the supabase client instance
//used to connect react application to the backened database


import {createClient} from "@supabase/supabase-js";

//supabase project url and public key loaded from the environment variable
const supabaseURL = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

//export supabase client for use in the other files
export const supabase = createClient(supabaseURL, supabaseAnonKey);