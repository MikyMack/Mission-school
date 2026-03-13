const Gallery = require('../models/Gallery');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const deleteImageFromCloudinary = async (imageUrl) => {
  if (!imageUrl) return;
  
  try {
      const publicId = imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
  } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
  }
};

exports.createGallery = async (req, res) => {
  try {
      const { category, youtubeLink } = req.body;
      
      if (!req.file) {
          return res.status(400).json({ message: 'Gallery image is required' });
      }

      const gallery = new Gallery({
          category,
          youtubeLink,
          image: req.file.path
      });

      await gallery.save();
      res.status(201).json(gallery);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create gallery item', error: error.message });
  }
};

exports.getAllGallery = async (req, res) => {
  try {
      const searchTerm = req.query.search || '';
      let query = {};
      
      if (searchTerm) {
          query = {
              $or: [
                  { category: { $regex: searchTerm, $options: 'i' } },
                  { youtubeLink: { $regex: searchTerm, $options: 'i' } }
              ]
          };
      }

      const galleryItems = await Gallery.find(query).sort({ createdAt: -1 });
      res.json(galleryItems);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch gallery items', error: error.message });
  }
};

exports.getGalleryById = async (req, res) => {
  try {
      const galleryItem = await Gallery.findById(req.params.id);
      if (!galleryItem) {
          return res.status(404).json({ message: 'Gallery item not found' });
      }
      res.json(galleryItem);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch gallery item', error: error.message });
  }
};

exports.updateGallery = async (req, res) => {
  try {
      const { category, youtubeLink } = req.body;
      const galleryId = req.params.id;
      
      const existingGallery = await Gallery.findById(galleryId);
      if (!existingGallery) {
          return res.status(404).json({ message: 'Gallery item not found' });
      }

      const updateData = { 
          category,
          youtubeLink
      };

      if (req.file) {
          // Delete old image from Cloudinary
          await deleteImageFromCloudinary(existingGallery.image);
          updateData.image = req.file.path;
      }

      const updatedGallery = await Gallery.findByIdAndUpdate(
          galleryId,
          updateData,
          { new: true }
      );

      res.json(updatedGallery);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update gallery item', error: error.message });
  }
};

exports.deleteGallery = async (req, res) => {
  try {
      const galleryId = req.params.id;
      const galleryItem = await Gallery.findById(galleryId);
      
      if (!galleryItem) {
          return res.status(404).json({ message: 'Gallery item not found' });
      }

      // Delete associated image from Cloudinary
      await deleteImageFromCloudinary(galleryItem.image);

      // Delete the gallery item from database
      await Gallery.findByIdAndDelete(galleryId);

      res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to delete gallery item', error: error.message });
  }
};

exports.toggleGalleryActive = async (req, res) => {
  try {
      const galleryItem = await Gallery.findById(req.params.id);
      if (!galleryItem) {
          return res.status(404).json({ message: 'Gallery item not found' });
      }

      galleryItem.isActive = !galleryItem.isActive;
      await galleryItem.save();

      res.json(galleryItem);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to toggle gallery status', error: error.message });
  }
};
