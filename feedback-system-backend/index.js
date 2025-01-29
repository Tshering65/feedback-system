const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const adminRoutes = require("./routes/adminRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: [
      "https://nppf-feedback-system.vercel.app/",
      "http://localhost:3000", // Adjust based on your local development port
    ],
    credentials: true,
  })
);


app.use(express.json());
app.use(bodyParser.json());

// ❌ Remove local uploads folder (Vercel doesn't support file storage)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
    serverSelectionTimeoutMS: 30000,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err.message);
    process.exit(1);
  });

// API Routes
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("Feedback System Backend is Running 🚀");
});

// ✅ Export Express app for Vercel
module.exports = app;
