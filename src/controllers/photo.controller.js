const imageProcessor = require('../utils/imageProcessor');
const storageService = require('../services/storage.service');
const { supabaseAdmin, supabase } = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

const MAX_PHOTOS_PER_GUEST = 50;

exports.uploadPhoto = async (req, res) => {
    try {
        const { slug } = req.params;
        const guest = req.session.guest;
        
        if (guest.photoCount >= MAX_PHOTOS_PER_GUEST) {
            return res.status(403).json({ error: 'Photo limit reached' });
        }
        
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }
        
        const photoId = uuidv4();
        
        // Process images
        const optimizedBuffer = await imageProcessor.optimize(req.file.buffer);
        const thumbnailBuffer = await imageProcessor.createThumbnail(req.file.buffer);
        
        const mainPath = `${slug}/photos/${photoId}.webp`;
        const thumbPath = `${slug}/thumbnails/${photoId}.webp`;
        
        // Upload to storage using service role for bypass RLS if needed, or anon if public
        await storageService.uploadBuffer(mainPath, optimizedBuffer, 'image/webp');
        await storageService.uploadBuffer(thumbPath, thumbnailBuffer, 'image/webp');
        
        // Save metadata
        const { data, error } = await supabaseAdmin.from('photos').insert({
            wedding_id: guest.weddingId,
            guest_name: guest.name,
            storage_path: mainPath,
            thumbnail_path: thumbPath
        });
        
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to save photo metadata' });
        }
        
        // Update session
        req.session.guest.photoCount += 1;
        
        res.json({ success: true, photoCount: req.session.guest.photoCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Upload failed' });
    }
};

exports.getPhotos = async (req, res) => {
    try {
        const { slug } = req.params;
        
        // Find wedding id
        const { data: wedding } = await supabaseAdmin
            .from('weddings')
            .select('id')
            .eq('slug', slug)
            .single();
            
        if (!wedding) {
            return res.status(404).json({ error: 'Wedding not found' });
        }
        
        const { data: photos, error } = await supabaseAdmin
            .from('photos')
            .select('*')
            .eq('wedding_id', wedding.id)
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        
        // Add full public URLs for the frontend
        const photosWithUrls = photos.map(photo => ({
            ...photo,
            imageUrl: storageService.getPublicUrl(photo.storage_path),
            thumbnailUrl: storageService.getPublicUrl(photo.thumbnail_path)
        }));
        
        res.json({ photos: photosWithUrls });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load photos' });
    }
};
