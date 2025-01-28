const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const adminRoutes = require("./routes/adminRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed Origins (Add your deployed frontend domain here)
const allowedOrigins = [
  "http://localhost:3000", // Local development frontend
  "https://nppf-feedback-system-j7lqnc9y4-developers-projects-b07dc10f.vercel.app", // Deployed frontend
];

// CORS Configuration to allow specific origins
app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        // Allow requests with no origin (like mobile apps or curl requests)
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ MONGO_URI is not defined in .env file.");
  process.exit(1);
}

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase timeout
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err.message);
    process.exit(1); // Exit process on connection failure
  });

// API Routes
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("Feedback System Backend is Running 🚀");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
