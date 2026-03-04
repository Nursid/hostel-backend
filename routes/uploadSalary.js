const express = require("express");
const router = express.Router();
const multer = require("multer");

const SallaryController = require("../controller/SallaryController");

// Use memory storage (NO file save)
const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/upload-excel",
  upload.single("file"),
  SallaryController.createSallary
);

module.exports = router;