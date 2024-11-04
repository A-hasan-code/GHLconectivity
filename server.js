const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const sequelize = require('./config/sequelize');
const authRoutes = require('./routes/auth.Routes');
const User = require('./routes/User.Routes')
const Setting = require('./routes/Setting.Routes')
const path = require('path');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(bodyParser.json());
const corsOptions = {
    origin: '*',
    credentials: true
};

// Sync the database 
sequelize.sync()
    .then(() => {
        console.log('Database synced');
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });
// Middleware setup
app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use('/api', authRoutes);
app.use('/api', User)
app.use('/api', Setting)
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
