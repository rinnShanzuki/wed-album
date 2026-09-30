module.exports = (req, res, next) => {
    const slug = req.params.slug;
    
    if (!req.session || !req.session.guest) {
        return res.redirect(`/w/${slug}/name`);
    }
    
    // Check if session belongs to this wedding
    if (req.session.guest.weddingSlug !== slug) {
        return res.redirect(`/w/${slug}/name`);
    }
    
    next();
};
