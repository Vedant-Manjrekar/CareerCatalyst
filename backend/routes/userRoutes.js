const express = require("express");
const User = require("../models/User");
const SavedCareer = require("../models/SavedCareer");
const auth = require("../middleware/auth");
const { updateUserStats } = require("../utils/stats");
const router = express.Router();
router.use(express.json());

// Get current user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update user profile (name, avatar, designation)
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, avatar_no, designation, location } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user,
      { name, avatar_no, designation, location, lastActive: Date.now() },
      { new: true }
    ).select("-password");
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update user skills
router.put("/skills", auth, async (req, res) => {
  try {
    const { skills } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user,
      { skills, lastActive: Date.now() },
      { new: true }
    ).select("-password");
    
    await updateUserStats(req.user);
    const updatedUser = await User.findById(req.user).select("-password");
    
    res.json({ success: true, data: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Approve a user (set isApproved to true)
router.patch("/approve/:id", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Save a resource
router.post("/resources/save", auth, async (req, res) => {
  try {
    console.log("Save resource request:", req.body);
    console.log("User ID:", req.user);
    
    const { title, url, type, duration } = req.body;
    const user = await User.findById(req.user);
    
    if (!user) {
      console.error("User not found:", req.user);
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    console.log("User found:", user.email);
    console.log("Current savedResources:", user.savedResources);
    
    // Initialize savedResources if it doesn't exist (for existing users)
    if (!user.savedResources) {
      console.log("Initializing savedResources array");
      user.savedResources = [];
    }
    
    // Check if already saved
    if (user.savedResources.some(r => r.url === url)) {
      return res.status(400).json({ success: false, message: "Resource already saved" });
    }
    
    console.log("Pushing new resource:", { title, url, type, duration });
    user.savedResources.push({ title, url, type, duration });
    
    console.log("Saving user...");
    user.lastActive = Date.now();
    await user.save();
    
    await updateUserStats(req.user);
    
    console.log("Resource saved successfully");
    res.json({ success: true, data: user.savedResources });
  } catch (err) {
    console.error("Save resource error:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Remove a saved resource
router.delete("/resources/remove", auth, async (req, res) => {
  try {
    const { url } = req.body;
    const user = await User.findById(req.user);
    
    // Initialize savedResources if it doesn't exist
    if (!user.savedResources) {
      user.savedResources = [];
    }
    
    user.savedResources = user.savedResources.filter(r => r.url !== url);
    user.lastActive = Date.now();
    await user.save();
    
    await updateUserStats(req.user);
    
    res.json({ success: true, data: user.savedResources });
  } catch (err) {
    console.error("Remove resource error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
