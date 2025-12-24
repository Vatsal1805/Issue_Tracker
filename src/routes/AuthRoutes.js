const router=require('express').Router();
const AuthHandler=require('../handlers/AuthHandler');



router.post('/register',AuthHandler.register);
router.post('/login',AuthHandler.login);

module.exports=router;