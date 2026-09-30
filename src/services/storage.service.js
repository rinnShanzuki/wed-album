const { supabaseAdmin } = require('../config/supabase');

const BUCKET_NAME = 'wedding-photos';

exports.uploadBuffer = async (path, buffer, contentType) => {
    const { data, error } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .upload(path, buffer, {
            contentType,
            upsert: true
        });
        
    if (error) {
        throw error;
    }
    
    return data;
};

exports.getPublicUrl = (path) => {
    const { data } = supabaseAdmin.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path);
        
    return data.publicUrl;
};
