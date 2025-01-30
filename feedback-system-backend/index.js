const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const adminRoutes = require("./routes/adminRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Middleware (Handles CORS with one solution)
app.use(
  cors({
    origin: "https://feedback-system-frontend.vercel.app", // Specify your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

// ✅ Body Parser Middleware
app.use(bodyParser.json()); // Parses JSON bodies
app.use(express.json()); // Another body parser (Express's built-in)

// ✅ Serve Static Uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

// ✅ MongoDB Connection
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
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// ✅ Routes
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Root Route (for health check and debugging)
app.get("/", (req, res) => {
  res.send("Feedback System Backend is Running 🚀");
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
