const express = require("express");
const router = express.Router();
const admissionController = require("../controllers/admissionController");

router.post("/", admissionController.submitEnquiry);

module.exports = router;