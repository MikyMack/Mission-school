const Alumni = require('../models/Alumni');
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

exports.createAlumni = async (req, res) => {
  try {
      const { name, message, batch, date, currentPosition } = req.body;
      
      if (!req.file) {
          return res.status(400).json({ message: 'Profile picture is required' });
      }

      const alumni = new Alumni({
          name,
          message,
          batch,
          date,
          currentPosition,
          profilePic: req.file.path
      });

      await alumni.save();
      res.status(201).json(alumni);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create alumni', error: error.message });
  }
};

exports.getAllAlumni = async (req, res) => {
  try {
      const searchTerm = req.query.search || '';
      let query = {};
      
      if (searchTerm) {
          query = {
              $or: [
                  { name: { $regex: searchTerm, $options: 'i' } },
                  { message: { $regex: searchTerm, $options: 'i' } },
                  { batch: { $regex: searchTerm, $options: 'i' } },
                  { currentPosition: { $regex: searchTerm, $options: 'i' } }
              ]
          };
      }

      const alumni = await Alumni.find(query).sort({ date: -1 });
      res.json(alumni);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch alumni', error: error.message });
  }
};

exports.getAlumniById = async (req, res) => {
  try {
      const alumni = await Alumni.findById(req.params.id);
      if (!alumni) {
          return res.status(404).json({ message: 'Alumni not found' });
      }
      res.json(alumni);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch alumni', error: error.message });
  }
};

exports.updateAlumni = async (req, res) => {
  try {
      const { name, message, batch, date, currentPosition } = req.body;
      const alumniId = req.params.id;
      
      const existingAlumni = await Alumni.findById(alumniId);
      if (!existingAlumni) {
          return res.status(404).json({ message: 'Alumni not found' });
      }

      const updateData = { 
          name,
          message,
          batch,
          date,
          currentPosition
      };

      if (req.file) {
          // Delete old image from Cloudinary
          await deleteImageFromCloudinary(existingAlumni.profilePic);
          updateData.profilePic = req.file.path;
      }

      const updatedAlumni = await Alumni.findByIdAndUpdate(
          alumniId,
          updateData,
          { new: true }
      );

      res.json(updatedAlumni);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update alumni', error: error.message });
  }
};

exports.deleteAlumni = async (req, res) => {
  try {
      const alumniId = req.params.id;
      const alumni = await Alumni.findById(alumniId);
      
      if (!alumni) {
          return res.status(404).json({ message: 'Alumni not found' });
      }

      // Delete associated image from Cloudinary
      await deleteImageFromCloudinary(alumni.profilePic);

      // Delete the alumni from database
      await Alumni.findByIdAndDelete(alumniId);

      res.json({ message: 'Alumni deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to delete alumni', error: error.message });
  }
};
