const AuthService = require('../services/AuthService');

class AuthHandler {
    constructor() {
        this.authService = new AuthService();
    }

    async register(req, res, next) {
        try{
            const result = await this.authService.register(req.body);
            res.status(201).json(result);
        }catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const result = await this.authService.login(req.body);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getCurrentUser(req, res, next) {
        try {
            const user = await this.authService.getCurrentUser(req.user.id);
            res.status(200).json({ user });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthHandler;