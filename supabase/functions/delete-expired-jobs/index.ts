import { serve } from "https://deno.land/std/http/server.ts";
import "https://deno.land/std@0.168.0/dotenv/load.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Access environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Check if environment variables are set
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Service Role Key is missing in environment variables.");
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async () => {
  try {
    // Get the current date
    const currentDate = new Date().toISOString().split("T")[0];

    // Delete rows where date_to is less than the current date
    const { data, error } = await supabase
      .from("jobs")
      .delete()
      .lt("date_to", currentDate);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ deleted_rows: data }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});