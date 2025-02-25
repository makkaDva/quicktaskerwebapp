// Импортујте Supabase клијент
import { createClient } from '@supabase/supabase-js'

// Иницијализујте Supabase клијент са env променљивима и опцијама за редирекцију
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      redirectTo: process.env.NEXT_PUBLIC_SITE_URL // Додајте URL вашег pre-production сервера
    }
  }
)

// Експортујте клијент за употребу у другим фајловима
export default supabase