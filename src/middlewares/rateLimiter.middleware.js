const RateLimiter = require('../utils/RateLimiter');

const rateLimiterMiddleware = (req, res, next) => {
    try{
        const key = req.ip;
        RateLimiter.check(key);
        next();
    }
    catch (error) {
        next(error);
    }
}

module.exports = rateLimiterMiddleware;