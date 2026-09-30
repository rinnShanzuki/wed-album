const QRCode = require('qrcode');

exports.generateWeddingQR = async (slug, host) => {
    const url = `https://${host}/w/${slug}`;
    try {
        const qrDataUrl = await QRCode.toDataURL(url, {
            errorCorrectionLevel: 'H',
            margin: 2,
            color: {
                dark: '#4A3B2C', // Dark brown
                light: '#FDFBF7' // Ivory
            }
        });
        return qrDataUrl;
    } catch (err) {
        console.error('Failed to generate QR', err);
        return null;
    }
};
