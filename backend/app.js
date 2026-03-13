const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../assets')));
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

// Routes
const adminRoutes = require('./routes/adminRoutes');
const academicRotes = require('./routes/academicRoutes');
const aluminiRoutes = require('./routes/alumniRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const eventRoutes = require('./routes/eventRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const publicRoutes = require('./routes/publicRoutes');

app.use('/admin', adminRoutes);
app.use('/', publicRoutes);
app.use('/notice', noticeRoutes);
app.use('/gallery', galleryRoutes);
app.use('/event', eventRoutes);
app.use('/banner', bannerRoutes);
app.use('/alumini', aluminiRoutes);
app.use('/academic', academicRotes);

app.use(async (req, res) => {
  res.status(404).render('error', { title: 'Page Not Found' });
});

module.exports = app;
