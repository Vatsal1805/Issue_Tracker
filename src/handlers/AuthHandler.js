const AuthService = require('../services/AuthService');

class AuthHandler {
    async register(req, res, next) {
        try{
            const result = await AuthService.register(req.body);
            res.status(201).json(result);
        }catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const result = await AuthService.login(req.body);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthHandler();