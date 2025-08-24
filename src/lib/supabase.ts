import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = SUPABASE_URL!
const supabaseAnonKey = SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)