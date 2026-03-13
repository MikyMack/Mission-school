const Event = require('../models/Event');

// Create a new event
exports.createEvent = async (req, res) => {
    try {
        const { date, title, description, coordinatorName, coordinatorContact, eventPlace, isActive } = req.body;
        
        const event = new Event({
            date,
            title,
            description,
            coordinatorName,
            coordinatorContact,
            eventPlace,
            isActive: isActive !== 'false',
            image: req.file ? req.file.path : undefined
        });

        await event.save();
        res.status(201).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create event', error: error.message });
    }
};

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const searchTerm = req.query.search || '';
        let query = {};
        
        if (searchTerm) {
            query = {
                $or: [
                    { title: { $regex: searchTerm, $options: 'i' } },
                    { description: { $regex: searchTerm, $options: 'i' } },
                    { coordinatorName: { $regex: searchTerm, $options: 'i' } },
                    { eventPlace: { $regex: searchTerm, $options: 'i' } }
                ]
            };
        }

        const events = await Event.find(query).sort({ date: -1 });
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch events', error: error.message });
    }
};

// Get a single event by ID
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch event', error: error.message });
    }
};

// Update an event
exports.updateEvent = async (req, res) => {
    try {
        const { date, title, description, coordinatorName, coordinatorContact, eventPlace, isActive } = req.body;
        
        const updateData = {
            date,
            title,
            description,
            coordinatorName,
            coordinatorContact,
            eventPlace,
            isActive: isActive !== 'false'
        };

        if (req.file) {
            updateData.image = req.file.path;
        }

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update event', error: error.message });
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete event', error: error.message });
    }
};

// Toggle event status
exports.toggleEventActive = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.isActive = !event.isActive;
        await event.save();

        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to toggle event status', error: error.message });
    }
};