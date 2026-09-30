module.exports = (req, res, next) => {
    const slug = req.params.slug;
    const isApi = req.originalUrl.startsWith('/api/');
    
    if (!req.session || !req.session.guest) {
        if (isApi) return res.status(401).json({ error: 'Session expired. Please refresh the page.' });
        return res.redirect(`/w/${slug}/name`);
    }
    
    // Check if session belongs to this wedding (only for guest routes where slug is in URL)
    if (!isApi && req.session.guest.weddingSlug !== slug) {
        return res.redirect(`/w/${slug}/name`);
    }
    
    next();
};
