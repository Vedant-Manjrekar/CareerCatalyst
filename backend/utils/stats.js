const User = require("../models/User");
const SavedCareer = require("../models/SavedCareer");

const updateUserStats = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const numSkills = user.skills?.length || 0;
    const numResources = user.savedResources?.length || 0;
    const numSavedCareers = await SavedCareer.countDocuments({ userId });

    await User.findByIdAndUpdate(userId, {
      skillCount: numSkills,
      savedPathCount: numSavedCareers,
      lastActive: Date.now()
    });
    
  } catch (err) {
    console.error("Error updating user stats:", err);
  }
};

module.exports = { updateUserStats };
