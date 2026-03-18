const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const Blog = require("../models/Blog");
const Event = require("../models/Event");
const Banner = require("../models/Banner");
const Testimonial = require("../models/Testimonial");
const Notice = require("../models/Notice");
const Gallery = require("../models/Gallery");
const AdmissionEnquiry = require("../models/AdmissionEnquiry");
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
    const [gallery, notice, banner, blog, testimonials, event, enquiries] =
      await Promise.all([
        Gallery.find().sort({ createdAt: -1 }),
        Notice.find().sort({ createdAt: -1 }),
        Banner.find().sort({ createdAt: -1 }),
        Blog.find().sort({ createdAt: -1 }),
        Testimonial.find().sort({ createdAt: -1 }),
        Event.find().sort({ createdAt: -1 }),
        AdmissionEnquiry.find().sort({ createdAt: -1 }),
      ]);

    res.render("admin-dashboard", {
      title: "Admin Dashboard",
      gallery,
      notice,
      banner,
      blog,
      testimonials,
      event,
      enquiries
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

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

    // 🔥 TOTAL COUNT
    const totalBlogs = await Blog.countDocuments(query);

    // 🔥 PAGINATED DATA
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.render("admin-blogs", {
      title: "Blog Management",
      blogs,
      searchTerm,
      currentPage: page,
      totalPages: Math.ceil(totalBlogs / limit),
      totalBlogs,
      limit,
      error: null,
    });

  } catch (error) {
    console.error("Admin Blog Load Error:", error);

    res.status(500).render("admin-blogs", {
      title: "Blog Management",
      blogs: [],
      searchTerm: "",
      currentPage: 1,
      totalPages: 1,
      totalBlogs: 0,
      limit: 10,
      error: "Failed to load blogs",
    });
  }
});


router.get("/admin-events", isAuthenticated, async (req, res) => {
  try {
    const searchTerm = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

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

    const totalEvents = await Event.countDocuments(query);

    const events = await Event.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.render("admin-events", {
      title: "Event Management",
      events,
      searchTerm,
      currentPage: page,
      totalPages: Math.ceil(totalEvents / limit),
      totalEvents,
      limit,
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let query = {};

    if (searchTerm) {
      query = {
        $or: [
          { category: { $regex: searchTerm, $options: "i" } },
          { youtubeLink: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    const totalItems = await Gallery.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const galleryItems = await Gallery.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.render("admin-gallery", {
      title: "Gallery Management",
      galleryItems,
      searchTerm,
      currentPage: page,
      totalPages,
      totalItems,
      limit
    });

  } catch (error) {
    console.error(error);
    res.status(500).render("admin-gallery", {
      error: "Failed to load gallery items",
      galleryItems: [],
      searchTerm: "",
      currentPage: 1,
      totalPages: 1,
      totalItems: 0
    });
  }
});
router.get("/admin-testimonials", isAuthenticated, async (req, res) => {
  try {
    const searchTerm = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

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

    const total = await Testimonial.countDocuments(query);

    const testimonials = await Testimonial.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.render("admin-testimonials", {
      title: "Testimonials Management",
      testimonials,
      searchTerm,
      currentPage: page,
      totalPages,
      limit
    });

  } catch (error) {
    console.error(error);
    res.status(500).render("admin-testimonials", {
      title: "Testimonials Management",
      testimonials: [],
      searchTerm: "",
      currentPage: 1,
      totalPages: 1,
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // 🔍 Optional search
    const searchTerm = req.query.search || "";
    let query = {};

    if (searchTerm) {
      query.title = { $regex: searchTerm, $options: "i" };
    }

    const totalBanners = await Banner.countDocuments(query);

    const banners = await Banner.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.render("admin-banner", {
      title: "Banner Management",
      banners,
      currentPage: page,
      totalPages: Math.ceil(totalBanners / limit),
      totalBanners,
      limit,
      searchTerm,
      error: null,
    });

  } catch (error) {
    console.error(error);
    res.status(500).render("admin-banner", {
      error: "Failed to load banners",
      banners: [],
      currentPage: 1,
      totalPages: 1,
      totalBanners: 0,
      limit: 10,
      searchTerm: "",
    });
  }
});

router.get("/admin-enquiries", isAuthenticated, async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || "";

    const skip = (page - 1) * limit;

    let filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    const total = await AdmissionEnquiry.countDocuments(filter);

    const enquiries = await AdmissionEnquiry
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.render("admin-enquiries", {
      title: "Admission Enquiries",
      enquiries,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      selectedStatus: status
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// PATCH route to toggle enquiry status
router.post("/enquiries/:id", isAuthenticated, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const enquiry = await AdmissionEnquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }

    enquiry.status = status;
    await enquiry.save();

    res.json({
      success: true,
      message: "Status updated successfully",
      status: enquiry.status
    });

  } catch (error) {
    console.error("Update Enquiry Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating enquiry"
    });
  }
});

router.delete("/enquiries/:id", isAuthenticated, async (req, res) => {
  try {
    const enquiry = await AdmissionEnquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.json({ success: true, message: "Enquiry deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while deleting enquiry" });
  }
});


module.exports = router;
