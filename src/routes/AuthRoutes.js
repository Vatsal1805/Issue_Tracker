const router=require('express').Router();
const AuthHandler=require('../handlers/AuthHandler');

const authHandler = new AuthHandler();

router.post('/register',authHandler.register.bind(authHandler));
router.post('/login',authHandler.login.bind(authHandler));

module.exports=router;