// index.js
const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); // Must come first

const cors = require('cors');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

connectDB();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in mode on port ${PORT}`);
});

