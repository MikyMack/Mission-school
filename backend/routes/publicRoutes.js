const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const Event = require('../models/Event');
const Gallery = require('../models/Gallery');
const Notice = require('../models/Notice');
const Blog = require('../models/Blog');
const Testimonial = require('../models/Testimonial');
const SEO = require('../config/seo');

function baseUrl(req) {
  return (process.env.SITE_URL || '').replace(/\/$/, '') || `${req.protocol}://${req.get('host')}`;
}

router.get('/robots.txt', (req, res) => {
  const base = baseUrl(req);
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    'Disallow: /api/',
    '',
    `Sitemap: ${base}/sitemap.xml`
  ].join('\n');
  res.type('text/plain');
  res.send(body);
});

router.get('/sitemap.xml', async (req, res) => {
  try {
    const base = baseUrl(req);
    const blogs = await Blog.find().select('slug updatedAt').lean();
    const staticPaths = [
      { path: '/', priority: '1.0', changefreq: 'weekly' },
      { path: '/about', priority: '0.9', changefreq: 'monthly' },
      { path: '/events', priority: '0.8', changefreq: 'weekly' },
      { path: '/our-programs', priority: '0.8', changefreq: 'monthly' },
      { path: '/gallery', priority: '0.8', changefreq: 'weekly' },
      { path: '/blogs', priority: '0.9', changefreq: 'weekly' },
      { path: '/contact', priority: '0.8', changefreq: 'monthly' },
      { path: '/unesco', priority: '0.7', changefreq: 'monthly' },
      { path: '/quality-education', priority: '0.8', changefreq: 'monthly' }
    ];

    const urls = staticPaths
      .map(
        (u) =>
          `<url><loc>${base}${u.path}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
      )
      .join('');

    const blogUrls = blogs
      .map((b) => {
        const lastmod = b.updatedAt
          ? new Date(b.updatedAt).toISOString().split('T')[0]
          : '';
        const lm = lastmod ? `<lastmod>${lastmod}</lastmod>` : '';
        return `<url><loc>${base}/blog/${encodeURIComponent(b.slug)}</loc>${lm}<changefreq>monthly</changefreq><priority>0.7</priority></url>`;
      })
      .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}${blogUrls}
</urlset>`;
    res.type('application/xml');
    res.send(xml);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating sitemap');
  }
});

router.get('/', async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [banners, events, galleries, notices, blogs, testmonials] = await Promise.all([
      Banner.find({ isActive: true }).sort({ createdAt: -1 }),
      Event.find({ isActive: true, date: { $gte: startOfToday } }).sort({ date: 1 }),
      Gallery.find({ isActive: true }).sort({ createdAt: -1 }),
      Notice.find({ isActive: true }).sort({ createdAt: -1 }),
      Blog.find().sort({ createdAt: -1 }),
      Testimonial.find().sort({ date: -1 })
    ]);

    res.render('home', {
      title: 'Home',
      ...SEO.pages.home,
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
    const testmonials = await Testimonial.find().sort({ date: -1 });
    res.render('about', {
      title: 'About us',
      ...SEO.pages.about,
      testmonials
    });
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

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const allEvents = await Event.find({ isActive: true }).sort({ date: 1 });

    const upcomingEvents = allEvents.filter(event => event.date >= startOfToday);
    const pastEvents = allEvents.filter(event => event.date < startOfToday);

    const orderedEvents = [...upcomingEvents, ...pastEvents];

    const totalEvents = orderedEvents.length;
    const totalPages = Math.ceil(totalEvents / limit);
    const paginatedEvents = orderedEvents.slice(skip, skip + limit);

    res.render('event', {
      title: 'Events',
      ...SEO.pages.events,
      events: paginatedEvents,
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
    const notices = await Notice.find({ isActive: true }).sort({ createdAt: -1 });
    res.render('our-programs', {
      title: 'Our programs',
      ...SEO.pages.programs,
      notices
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading notice page data');
  }
});

router.get('/gallery', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    const totalCount = await Gallery.countDocuments({ isActive: true });

    const gallery = await Gallery.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalCount / limit);

    res.render('gallery', {
      title: 'Gallery',
      ...SEO.pages.gallery,
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
    const page = parseInt(req.query.page) || 1;
    const limit = 6;

    const total = await Blog.countDocuments();
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const blogs = await Blog.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.render('blogs', {
      title: 'Blogs',
      ...SEO.pages.blogs,
      blogs,
      currentPage: page,
      totalPages
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading blogs page data');
  }
});

router.get('/blog/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).lean();

    if (!blog) {
      return res.status(404).send('Blog not found');
    }

    const base = baseUrl(req);
    const absImage =
      blog.imageUrl && /^https?:\/\//i.test(blog.imageUrl)
        ? blog.imageUrl
        : `${base}${blog.imageUrl.startsWith('/') ? '' : '/'}${blog.imageUrl}`;

    res.render('blogDetails', {
      title: blog.title,
      seoTitle: blog.metaTitle || `Mission School | ${blog.title}`,
      seoDescription: blog.metaDescription,
      seoKeywords: Array.isArray(blog.metaKeywords) ? blog.metaKeywords.join(', ') : '',
      seoImage: absImage,
      seoType: 'article',
      blog
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading blog details');
  }
});

router.get('/contact', async (req, res) => {
  try {
    res.render('contact', {
      title: 'Contact us',
      ...SEO.pages.contact
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading contact page data');
  }
});

router.get('/unesco', async (req, res) => {
  try {
    res.render('unesco', {
      title: "UNESCO's Happy Schools Initiative",
      ...SEO.pages.unesco
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading contact page data');
  }
});

router.get('/quality-education', async (req, res) => {
  try {
    const testmonials = await Testimonial.find().sort({ date: -1 });
    res.render('quality-education', {
      title: 'Quality education',
      ...SEO.pages.quality,
      testmonials
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading contact page data');
  }
});

module.exports = router;
