const sharp = require('sharp');

exports.optimize = async (buffer) => {
    return await sharp(buffer)
        .resize(1920, 1920, {
            fit: sharp.fit.inside,
            withoutEnlargement: true
        })
        .webp({ quality: 80 })
        .toBuffer();
};

exports.createThumbnail = async (buffer) => {
    return await sharp(buffer)
        .resize(400, 400, {
            fit: sharp.fit.cover
        })
        .webp({ quality: 70 })
        .toBuffer();
};
