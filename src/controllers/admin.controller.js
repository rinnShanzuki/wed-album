const qrService = require('../services/qr.service');
const weddingService = require('../services/wedding.service');
const { supabase, supabaseAdmin } = require('../config/supabase');

exports.getLogin = (req, res) => {
    res.render('admin/login');
};

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    
    if (error || !data.session) {
        return res.render('admin/login', { error: 'Invalid credentials' });
    }
    
    res.cookie('sb-access-token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    
    res.redirect('/admin');
};

exports.postLogout = (req, res) => {
    res.clearCookie('sb-access-token');
    res.redirect('/admin/login');
};

exports.getQr = async (req, res) => {
    const wedding = await weddingService.getFirstWedding();
    if (!wedding) return res.status(404).send('No wedding found');
    
    const qrDataUrl = await qrService.generateWeddingQR(wedding.slug, req.get('host'));
    
    res.render('admin/qr', { wedding, qrDataUrl });
};

exports.getAlbum = async (req, res) => {
    const wedding = await weddingService.getFirstWedding();
    if (!wedding) return res.status(404).send('No wedding found');
    
    const { data: photos } = await supabaseAdmin
        .from('photos')
        .select('*')
        .eq('wedding_id', wedding.id)
        .order('created_at', { ascending: false });
        
    res.render('admin/album', { wedding, photos });
};

exports.deletePhoto = async (req, res) => {
    // Admin uses API to delete
    const { id } = req.params;
    
    // In a real app, delete from storage too. For MVP, we delete DB record.
    await supabaseAdmin.from('photos').delete().eq('id', id);
    
    res.json({ success: true });
};
