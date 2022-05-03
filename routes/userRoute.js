const express = require('express');
const route = express.Router();

const userController = require('./../controllers/userController')

route.post('/signup', userController.signUpUser);
route.post('/signin', userController.signInUser);
route.get('/logout', userController.logout);
route.patch('/update_user', userController.protect, userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateUser);
route.patch('/update_user_cv', userController.protect, userController.uploadUserCv, userController.updateUserCv);
route.patch('/update_infor', userController.protect, userController.updateInfor)
route.get('/get_me', userController.protect, userController.getMe);
route.get('/status/:id', userController.protect, userController.getStatus);
route.get('/search', userController.searchUser);
route.get('/get_cv', userController.get_cv);
route.get('/', userController.getAllUser);

module.exports = route;