// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://sqajjzwguywvspmxhnsz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxYWpqendndXl3dnNwbXhobnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyMzY0NDMsImV4cCI6MjA1MzgxMjQ0M30.FTfd3qz__8enmMDfzu_R-ay61Md1HZBhstacPC4UIHE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);