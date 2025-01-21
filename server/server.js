const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config({path: '.env'});

const app = express();
app.use(cors());
app.use(express.json());

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// Connect to Database
connectDB();

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('API Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));