const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const Event = require('../models/Event');
const Gallery = require('../models/Gallery');
const Notice = require('../models/Notice');
const Blog = require('../models/Blog');
const Testimonial = require('../models/Testimonial');




router.get('/', async (req, res) => {
    try {
        const [banners, events, galleries, notices, blogs, testmonials] = await Promise.all([
            Banner.find({ isActive: true }).sort({ createdAt: -1 }),
            Event.find({ isActive: true }).sort({ createdAt: -1 }),
            Gallery.find({ isActive: true }).sort({ createdAt: -1 }),
            Notice.find({ isActive: true }).sort({ createdAt: -1 }),
            Blog.find().sort({ createdAt: -1 }),
            Testimonial.find().sort({ date: -1 })
        ]);

        res.render('home', {
            title: 'Home',
            banners,
            events,
            galleries,
            notices,
            blogs,
            testmonials
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading home page data');
    }
});
router.get('/about', async (req, res) => {
    try {
        res.render('about', { title: 'About us'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading about page data');
    }
});
router.get('/events', async (req, res) => {
    try {
       
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6; 

        const skip = (page - 1) * limit;

        const totalEvents = await Event.countDocuments({ isActive: true });

        const events = await Event.find({ isActive: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalEvents / limit);

        res.render('event', {
            title: 'Event',
            events,
            currentPage: page,
            totalPages
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading event page data');
    }
});

router.get('/our-programs', async (req, res) => {
    try {
        const notices =await Notice.find({ isActive: true }).sort({ createdAt: -1 });
        res.render('our-programs', { title: 'our-programs',notices});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading notice page data');
    }
});



router.get('/gallery', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;        // Current page number, default 1
      const limit = 10;                                   // Number of items per page
      const skip = (page - 1) * limit;
  
      // Fetch total count of active gallery items
      const totalCount = await Gallery.countDocuments({ isActive: true });
  
      // Fetch paginated gallery items
      const gallery = await Gallery.find({ isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
  
      // Calculate total pages
      const totalPages = Math.ceil(totalCount / limit);
  
      res.render('gallery', {
        title: 'Gallery',
        gallery,
        currentPage: page,
        totalPages
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error loading gallery page data');
    }
  });
  
router.get('/blogs', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Current page
      const limit = 6; // Items per page
  
      const total = await Blog.countDocuments();
      const totalPages = Math.ceil(total / limit);
      const skip = (page - 1) * limit;
  
      const blogs = await Blog.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
  
      res.render('blogs', {
        title: 'Blogs',
        blogs,
        currentPage: page,
        totalPages
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).send('Error loading blogs page data');
    }
  });

  
router.get('/contact', async (req, res) => {
    try {
        res.render('contact', { title: 'contact us'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading contact page data');
    }
});
router.get('/unesco', async (req, res) => {
    try {
        res.render('unesco', { title: 'unesco'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading contact page data');
    }
});
router.get('/quality-education', async (req, res) => {
    try {
        res.render('quality-education', { title: 'quality-education'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading contact page data');
    }
});


module.exports = router;