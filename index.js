// index.js
const express = require("express");
const dotenv = require("dotenv");
dotenv.config(); // Must come first

const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");
const userRoute = require("./routes/userRoutes");
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

const corsOptions = {
  origin: ["https://todolist-frontend-beta-bay.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-requested-with",
    "Access-Control-Allow-Origin",
  ],
};

app.use(cors(corsOptions));

// Routes
app.use("/api/tasks", taskRoutes);

app.use("/api/user", userRoute);

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in mode on port ${PORT}`);
});
