const express = require('express');
const compression = require('compression');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const SEO = require('./config/seo');
require('dotenv').config();

const app = express();

if (process.env.TRUST_PROXY === '1') {
  app.set('trust proxy', 1);
}

app.use(compression());

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

app.use((req, res, next) => {
  const base = (process.env.SITE_URL || '').replace(/\/$/, '') || `${req.protocol}://${req.get('host')}`;
  res.locals.siteUrl = base;
  res.locals.siteName = SEO.siteName;
  res.locals.defaultSeoDescription = SEO.defaultDescription;
  res.locals.defaultSeoKeywords = SEO.defaultKeywords;
  res.locals.seoNoindex = false;
  res.locals.seoTitle = null;
  res.locals.seoDescription = null;
  res.locals.seoKeywords = null;
  res.locals.seoImage = null;
  res.locals.seoType = 'website';
  const pathOnly = req.originalUrl.split('?')[0];
  res.locals.canonicalUrl = `${base}${pathOnly}`;
  next();
});

const staticOpts = {
  maxAge: process.env.NODE_ENV === 'production' ? 7 * 24 * 60 * 60 * 1000 : 0,
  etag: true,
  lastModified: true
};

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../assets'), staticOpts));
app.set('view engine', 'ejs');

// Sessions
app.use(
  session({
      secret: process.env.SESSION_SECRET, 
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
  })
);
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), { maxAge: '1d', etag: true }));
// Routes
const adminRoutes = require('./routes/adminRoutes');
const blogRoutes = require('./routes/blogRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const eventRoutes = require('./routes/eventRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const admissionRoutes = require("./routes/admissionRoutes");
const publicRoutes = require('./routes/publicRoutes');

app.use('/admin', adminRoutes);
app.use('/notice', noticeRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/event', eventRoutes);
app.use('/banner', bannerRoutes);
app.use('/testimonial', testimonialRoutes);
app.use('/api/blog', blogRoutes);
app.use("/admission", admissionRoutes);
app.use('/', publicRoutes);


app.use(async (req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    seoTitle: 'Page Not Found | ' + SEO.siteName,
    seoDescription: SEO.pages.error.seoDescription,
    seoKeywords: SEO.pages.error.seoKeywords,
    seoNoindex: true
  });
});

module.exports = app;
