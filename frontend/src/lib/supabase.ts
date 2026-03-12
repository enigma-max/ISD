import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://zzbkphxxvfiwnhkepzcf.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_3HXoTxa6l6YnmJLPzyt_Ug_vyLw4_OG";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
