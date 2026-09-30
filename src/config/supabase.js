const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

if (!env.supabase.url || !env.supabase.anonKey || !env.supabase.serviceRoleKey) {
    console.warn('⚠️  Supabase credentials missing in .env');
}

// We use the service role key for admin operations (e.g. secure insertions, admin dashboard)
const supabaseAdmin = createClient(env.supabase.url || 'https://placeholder.supabase.co', env.supabase.serviceRoleKey || 'placeholder', {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// We use anon key for general things if needed, but mostly we'll use Admin on the backend to manage guest uploads securely
const supabase = createClient(env.supabase.url || 'https://placeholder.supabase.co', env.supabase.anonKey || 'placeholder');

module.exports = {
  supabase,
  supabaseAdmin
};
