// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bfymxnnacoqszftgtjwa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmeW14bm5hY29xc3pmdGd0andhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4NDE2NjgsImV4cCI6MjA1NTQxNzY2OH0.2BTWMd8pOX6WU0nRRgivmKMJx5seJ8Jui0G2egWAOn4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);