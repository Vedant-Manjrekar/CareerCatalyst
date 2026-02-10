const express = require("express");
const Resource = require("../models/Resource");
const auth = require("../middleware/auth");
const https = require("https");
const http = require("http");
const router = express.Router();

// Validate a link (HEAD request)
router.post("/validate-link", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ success: false, message: "URL is required" });

  try {
    const protocol = url.startsWith("https") ? https : http;
    const request = protocol.request(url, { method: "HEAD", timeout: 5000 }, (response) => {
      res.json({ 
        success: true, 
        isValid: response.statusCode >= 200 && response.statusCode < 400 
      });
    });

    request.on("error", () => {
      res.json({ success: true, isValid: false });
    });

    request.on("timeout", () => {
      request.destroy();
      res.json({ success: true, isValid: false });
    });

    request.end();
  } catch (err) {
    res.json({ success: true, isValid: false });
  }
});

// Get all resources
router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json({ success: true, data: resources });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add a resource (Admin only - simplification: for now just auth)
router.post("/", auth, async (req, res) => {
  try {
    const { title, url, type, duration } = req.body;
    const resource = await Resource.create({ title, url, type, duration });
    res.json({ success: true, data: resource });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete a resource
router.delete("/:id", auth, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }
    res.json({ success: true, message: "Resource deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
