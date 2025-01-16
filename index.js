// index.js
const express = require("express");
const dotenv = require("dotenv");
dotenv.config(); // Must come first

const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");

connectDB();
const app = express();

app.use(cors());
app.use(express.json());

// Dynamically allow origins
const allowedOrigins = [process.env.CLIENT_URL]; // Add your Vercel frontend URL here
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Include cookies if needed
};

app.use(cors(corsOptions));

// Routes
app.use("/api/tasks", taskRoutes);

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in mode on port ${PORT}`);
});
