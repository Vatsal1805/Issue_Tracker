const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/AuthRoutes');
const issueRoutes = require('./routes/issueRoutes');
const RateLimiter = require('./middlewares/rateLimiter.middleware');

const app = express();

// Enable CORS with specific options
app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Add global request logging BEFORE other middleware
app.use((req, res, next) => {
    console.log(`\n=== INCOMING REQUEST ===`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.url}`);
    console.log(`Headers:`, JSON.stringify(req.headers, null, 2));
    console.log(`Body:`, JSON.stringify(req.body, null, 2));
    console.log(`========================\n`);
    next();
});

app.use(RateLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);

// Add a simple test endpoint
app.get('/api/test', (req, res) => {
    console.log('Test endpoint hit!');
    res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

console.log('Routes mounted: /api/auth and /api/issues');


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: err.message || 'Internal Server Error',
    });
});

module.exports = app;
