const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/AuthRoutes');
const issueRoutes = require('./routes/issueRoutes');
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: err.message || 'Internal Server Error',
    });
});

module.exports = app;
