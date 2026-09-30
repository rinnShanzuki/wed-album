const weddingService = require('../services/wedding.service');

exports.getWelcome = async (req, res) => {
    const { slug } = req.params;
    const wedding = await weddingService.getWeddingBySlug(slug);
    
    if (!wedding) {
        return res.status(404).send('Wedding not found');
    }
    
    res.render('guest/welcome', { wedding });
};

exports.getName = async (req, res) => {
    const { slug } = req.params;
    const wedding = await weddingService.getWeddingBySlug(slug);
    
    if (!wedding) {
        return res.status(404).send('Wedding not found');
    }
    
    res.render('guest/name', { wedding });
};

exports.postName = async (req, res) => {
    const { slug } = req.params;
    const { guestName } = req.body;
    
    if (!guestName || guestName.trim() === '') {
        return res.redirect(`/w/${slug}/name`);
    }
    
    const wedding = await weddingService.getWeddingBySlug(slug);
    if (!wedding) {
        return res.status(404).send('Wedding not found');
    }
    
    req.session.guest = {
        weddingId: wedding.id,
        weddingSlug: slug,
        name: guestName.trim(),
        photoCount: 0
    };
    
    res.redirect(`/w/${slug}/camera`);
};

exports.getCamera = async (req, res) => {
    const { slug } = req.params;
    const wedding = await weddingService.getWeddingBySlug(slug);
    
    res.render('guest/camera', { 
        wedding, 
        guest: req.session.guest 
    });
};

exports.getAlbum = async (req, res) => {
    const { slug } = req.params;
    const wedding = await weddingService.getWeddingBySlug(slug);
    
    res.render('guest/album', { 
        wedding,
        guest: req.session.guest
    });
};

exports.getSuccess = async (req, res) => {
    const { slug } = req.params;
    const wedding = await weddingService.getWeddingBySlug(slug);
    
    res.render('guest/success', { wedding });
};
