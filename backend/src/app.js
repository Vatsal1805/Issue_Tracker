const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/AuthRoutes');
const issueRoutes = require('./routes/issueRoutes');
const RateLimiter = require('./middlewares/rateLimiter.middleware');

const app = express();

// Enable CORS with specific options
app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:3000', 'https://issue-tracker-ashy-nine.vercel.app', /\.vercel\.app$/],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());


app.use(RateLimiter);

// Root route for health check
app.get('/', (req, res) => {
    res.json({ 
        message: 'ApniSec Issue Tracker API is running!', 
        status: 'healthy',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            issues: '/api/issues',
            test: '/api/test'
        }
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);

// Add a simple test endpoint
app.get('/api/test', (req, res) => {
    console.log('Test endpoint hit!');
    res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});



app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: err.message || 'Internal Server Error',
    });
});

module.exports = app;
