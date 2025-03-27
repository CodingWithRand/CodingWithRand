const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SERVICE_ROLE, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
})


module.exports = { supabase }