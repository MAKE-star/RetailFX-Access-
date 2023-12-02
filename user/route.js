const authenticate = require('../middleware/authentication');
const userService = require('./service');
const express = require('express');
const router = express.Router();



router.post('/users/create',authenticate([0]),userService.createUser); 
router.get('/users',authenticate([0]), userService.getUsers);
router.get('/user/:userId',authenticate([0]), userService.getUser);
router.put('/user/:userId', authenticate([0]), userService.updateUser);
router.delete('/user/:userId',authenticate([0]), userService.deleteUser);
router.put('/user/deactivate/:userId',authenticate([0]), userService.deactivateUser);

router.get('/me', authenticate(),userService.getMe);



module.exports = router;