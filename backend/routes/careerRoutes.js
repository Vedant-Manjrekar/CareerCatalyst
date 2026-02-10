const express = require("express");
const SavedCareer = require("../models/SavedCareer");
const auth = require("../middleware/auth"); // JWT middleware
const router = express.Router();

router.post("/save", auth, async (req, res) => {
  try {
    const {
      id,
      title,
      matchPercentage,
      description,
      roleOverview,
      salaryRange,
      requiredSkills,
      missingSkills,
      roadmap,
      resources,
    } = req.body;

    if (!id || !title || !description || !requiredSkills || !roadmap) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const saved = await SavedCareer.create({
      userId: req.user,
      id,
      title,
      matchPercentage,
      description,
      roleOverview,
      salaryRange,
      requiredSkills,
      missingSkills,
      roadmap,
      resources,
    });

    res.json({ success: true, saved });
  } catch (err) {
    console.error("SAVE ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/my-saved", auth, async (req, res) => {
  try {
    7;
    const saved = await SavedCareer.find({ userId: req.user }).sort({
      createdAt: -1,
    });

    res.json({ success: true, data: saved });
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/all-saved", auth, async (req, res) => {
  try {
    const saved = await SavedCareer.find({}).sort({ createdAt: -1 });

    res.json({ success: true, data: saved });
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/remove/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    // We check for both _id (MongoDB) and the userId to prevent unauthorized deletions
    const deletedCareer = await SavedCareer.findOneAndDelete({
      _id: id,
      userId: req.user,
    });

    if (!deletedCareer) {
      return res.status(404).json({
        success: false,
        message: "Career path not found or you are not authorized to delete it",
      });
    }

    res.json({
      success: true,
      message: "Career path removed successfully",
    });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
