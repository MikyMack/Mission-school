const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const Blog = require("../models/Blog");
const Event = require("../models/Event");
const Banner = require("../models/Banner");
const Testimonial = require("../models/Testimonial");
const Notice = require("../models/Notice");
const Gallery = require("../models/Gallery");
const { isAuthenticated } = require("../middleware/auth");
const galleryRoutes = require("./galleryRoutes");
const authController = require("../controllers/authController");

router.use("/gallery", galleryRoutes);
// Login Page
router.get("/login", (req, res) => {
  res.render("login");
});

// Login Submit
router.post("/login", authController.login);

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
});

router.get("/admin-dashboard", isAuthenticated, async (req, res) => {
  try {
    const [gallery, notice, banner, blog, testimonials, event] =
      await Promise.all([
        Gallery.find().sort({ createdAt: -1 }),
        Notice.find().sort({ createdAt: -1 }),
        Banner.find().sort({ createdAt: -1 }),
        Blog.find().sort({ createdAt: -1 }),
        Testimonial.find().sort({ createdAt: -1 }),
        Event.find().sort({ createdAt: -1 }),
      ]);

    res.render("admin-dashboard", {
      title: "Admin Dashboard",
      gallery,
      notice,
      banner,
      blog,
      testimonials,
      event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("admin-dashboard", {
      title: "Admin Dashboard",
      gallery: [],
      notice: [],
      banner: [],
      blog: [],
      testimonials: [],
      event: [],
      error: "Failed to load dashboard data",
    });
  }
});

router.get("/admin-blogs", isAuthenticated, async (req, res) => {
  try {
    const searchTerm = req.query.search || "";

    let query = {};

    if (searchTerm) {
      query = {
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { metaTitle: { $regex: searchTerm, $options: "i" } },
          { author: { $regex: searchTerm, $options: "i" } },
          { content: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 });

    res.render("admin-blogs", {
      title: "Blog Management",
      blogs,
      searchTerm,
      error: null,
    });
  } catch (error) {
    console.error("Admin Blog Load Error:", error);

    res.status(500).render("admin-blogs", {
      title: "Blog Management",
      blogs: [],
      searchTerm: "",
      error: "Failed to load blogs",
    });
  }
});
router.get("/admin-events", isAuthenticated, async (req, res) => {
  try {
    const searchTerm = req.query.search || "";
    let query = {};

    if (searchTerm) {
      query = {
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
          { coordinatorName: { $regex: searchTerm, $options: "i" } },
          { eventPlace: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    const events = await Event.find(query).sort({ date: -1 });

    res.render("admin-events", {
      title: "Event Management",
      events,
      searchTerm,
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("admin-events", {
      error: "Failed to load events",
      events: [],
      searchTerm: "",
    });
  }
});
router.get("/admin-gallery", isAuthenticated, async (req, res) => {
  try {
    const searchTerm = req.query.search || "";
    let query = {};

    if (searchTerm) {
      query = {
        $or: [
          { category: { $regex: searchTerm, $options: "i" } },
          { youtubeLink: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    const galleryItems = await Gallery.find(query).sort({ createdAt: -1 });

    res.render("admin-gallery", {
      title: "Gallery Management",
      galleryItems,
      searchTerm,
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("admin-gallery", {
      error: "Failed to load gallery items",
      galleryItems: [],
      searchTerm: "",
    });
  }
});
router.get("/admin-testimonials", isAuthenticated, async (req, res) => {
  try {
    const searchTerm = req.query.search || "";
    let query = {};

    if (searchTerm) {
      query = {
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { designation: { $regex: searchTerm, $options: "i" } },
          { content: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    const testimonials = await Testimonial.find(query).sort({ createdAt: -1 });
    res.render("admin-testimonials", {
      title: "Testimonials Management",
      testimonials,
      searchTerm,
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("admin-testimonials", {
      title: "Testimonials Management",
      testimonials: [],
      searchTerm: "",
      error: "Failed to load testimonials",
    });
  }
});
router.get("/admin-notice", isAuthenticated, async (req, res) => {
  try {
    const searchTerm = req.query.search || "";
    let query = {};

    if (searchTerm) {
      query = {
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    const notices = await Notice.find(query).sort({ date: -1 });

    res.render("admin-notice", {
      title: "Notice Management",
      notices,
      searchTerm,
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("admin-notice", {
      error: "Failed to load notices",
      notices: [],
      searchTerm: "",
    });
  }
});
router.get("/admin-banner", isAuthenticated, async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });

    res.render("admin-banner", {
      title: "Banner Management",
      banners,
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("admin-banner", {
      error: "Failed to load banners",
      banners: [],
    });
  }
});

module.exports = router;
