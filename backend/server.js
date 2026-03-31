// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User.js");
const cors = require("cors");

dotenv.config();

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use(cors());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/career", require("./routes/careerRoutes"));
app.use("/api/resources", require("./routes/resourceRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

// --- Define Routes BEFORE starting server ---
app.get("/", (req, res) => {
  console.log("🔥 Express server file executed");

  res.send("Backend is running and connected to MongoDB!");
});

app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("✅ MongoDB connected successfully.");
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`Local URL: http://localhost:${PORT}`);
});
