const router = require('express').Router();
const userController = require('../Controllers/user');

router.post('/users/signup',userController.createUser)
router.post('/users/signin',userController.login)



module.exports = router;