const { supabaseAdmin } = require('../config/supabase');

exports.getWeddingBySlug = async (slug) => {
    const { data, error } = await supabaseAdmin
        .from('weddings')
        .select('*')
        .eq('slug', slug)
        .single();
        
    if (error || !data) {
        return null;
    }
    
    return data;
};

exports.getFirstWedding = async () => {
    const { data, error } = await supabaseAdmin
        .from('weddings')
        .select('*')
        .limit(1)
        .single();
        
    if (error || !data) {
        return null;
    }
    
    return data;
};
