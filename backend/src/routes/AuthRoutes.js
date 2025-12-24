const router=require('express').Router();
const AuthHandler=require('../handlers/AuthHandler');
const authMiddleware = require('../middlewares/AuthMiddleware');

const authHandler = new AuthHandler();

router.post('/register',authHandler.register.bind(authHandler));
router.post('/login',authHandler.login.bind(authHandler));
router.get('/me', authMiddleware.authenticate.bind(authMiddleware), authHandler.getCurrentUser.bind(authHandler));

module.exports=router;