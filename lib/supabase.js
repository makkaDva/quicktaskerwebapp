// Импортујте Supabase клијент
import { createClient } from '@supabase/supabase-js'

// Иницијализујте Supabase клијент са env променљивима
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Експортујте клијент за употребу у другим фајловима
export default supabase