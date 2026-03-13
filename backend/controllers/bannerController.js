const Banner = require('../models/Banner')
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to delete image from Cloudinary
const deleteImageFromCloudinary = async (imageUrl) => {
    if (!imageUrl) return;
    
    try {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
    }
};

exports.createBanner = async (req, res) => {
    try {
        const { title } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'Banner image is required' });
        }

        const banner = new Banner({
            title,
            image: req.file.path
        });

        await banner.save();
        res.status(201).json(banner);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create banner', error: error.message });
    }
};

exports.getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ createdAt: -1 });
        res.json(banners);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch banners', error: error.message });
    }
};

exports.getBannerById = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }
        res.json(banner);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch banner', error: error.message });
    }
};

exports.updateBanner = async (req, res) => {
    try {
        const { title } = req.body;
        const bannerId = req.params.id;
        
        const existingBanner = await Banner.findById(bannerId);
        if (!existingBanner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        const updateData = { title };

        if (req.file) {
            // Delete old image from Cloudinary
            await deleteImageFromCloudinary(existingBanner.image);
            updateData.image = req.file.path;
        }

        const updatedBanner = await Banner.findByIdAndUpdate(
            bannerId,
            updateData,
            { new: true }
        );

        res.json(updatedBanner);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update banner', error: error.message });
    }
};

exports.deleteBanner = async (req, res) => {
    try {
        const bannerId = req.params.id;
        const banner = await Banner.findById(bannerId);
        
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        // Delete associated image from Cloudinary
        await deleteImageFromCloudinary(banner.image);

        // Delete the banner from database
        await Banner.findByIdAndDelete(bannerId);

        res.json({ message: 'Banner deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete banner', error: error.message });
    }
};

exports.toggleBannerActive = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        banner.isActive = !banner.isActive;
        await banner.save();

        res.json(banner);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to toggle banner status', error: error.message });
    }
};