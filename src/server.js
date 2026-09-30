const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const env = require('./config/env');

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false // Disabled for simplicity with inline scripts/styles if needed, though better to configure properly in prod
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
// app.set('layout', 'layouts/main'); // We will use ejs includes instead of layout middleware to keep it simple

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Session setup
app.use(session({
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Routes
const guestRoutes = require('./routes/guest.routes');
const adminRoutes = require('./routes/admin.routes');
const apiRoutes = require('./routes/api.routes');

app.use('/w', guestRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

// Home route redirect to admin login if no specific wedding is set, or a landing page
app.get('/', (req, res) => {
    res.redirect('/admin/login');
});

// Error handling
app.use((req, res) => {
    res.status(404).send('Page not found');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(env.port, () => {
    console.log(`Server is running on http://localhost:${env.port}`);
});
