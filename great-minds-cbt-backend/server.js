const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectCbtDB = require('./src/config/db');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Initialize MongoDB Connection Pool
connectCbtDB();

// API Mounted Endpoints Route Blocks
app.use('/api/student', require('./src/routes/studentRoutes'));
app.use('/api/exams', require('./src/routes/examRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));

app.use((req, res) => res.status(404).json({ message: 'CBT requested endpoint route does not exist.' }));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Isolated CBT Backend actively running under production rules on port ${PORT}`));
