const { supabase } = require('../config/supabase');

module.exports = async (req, res, next) => {
    const token = req.cookies['sb-access-token'];
    
    if (!token) {
        return res.redirect('/admin/login');
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
        return res.redirect('/admin/login');
    }
    
    req.user = user;
    next();
};
