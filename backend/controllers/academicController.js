const Academic = require('../models/Academic');

// Create a new academic program
exports.createAcademic = async (req, res) => {
    try {
        const { title, availableSeats, requiredAge, description, subjects } = req.body;
        
        const academic = new Academic({
            title,
            availableSeats,
            requiredAge,
            description,
            subjects: subjects.split(',').map(s => s.trim()),
            image: req.file ? req.file.path : undefined
        });

        await academic.save();
        res.status(201).json(academic);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create academic program', error: error.message });
    }
};

// Get all academic programs
exports.getAllAcademics = async (req, res) => {
    try {
        const academics = await Academic.find().sort({ createdAt: -1 });
        res.json(academics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch academic programs', error: error.message });
    }
};

// Get a single academic program by ID
exports.getAcademicById = async (req, res) => {
    try {
        const academic = await Academic.findById(req.params.id);
        if (!academic) {
            return res.status(404).json({ message: 'Academic program not found' });
        }
        res.json(academic);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch academic program', error: error.message });
    }
};

// Update an academic program
exports.updateAcademic = async (req, res) => {
    try {
        const { title, availableSeats, requiredAge, description, subjects } = req.body;
        
        const updateData = {
            title,
            availableSeats,
            requiredAge,
            description,
            subjects: subjects.split(',').map(s => s.trim())
        };

        if (req.file) {
            updateData.image = req.file.path;
        }

        const academic = await Academic.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!academic) {
            return res.status(404).json({ message: 'Academic program not found' });
        }

        res.json(academic);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update academic program', error: error.message });
    }
};

// Delete an academic program
exports.deleteAcademic = async (req, res) => {
    try {
        const academic = await Academic.findByIdAndDelete(req.params.id);
        if (!academic) {
            return res.status(404).json({ message: 'Academic program not found' });
        }
        res.json({ message: 'Academic program deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete academic program', error: error.message });
    }
};