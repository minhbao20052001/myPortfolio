const express = require('express');
const route = express.Router();

const viewController = require('./../controllers/viewController')
const userController = require('./../controllers/userController')

// route.use(userController.isLogin);

route.get('/login', viewController.login)
route.get('/signup', viewController.signup)
route.get('/get_me', userController.protect, userController.isLogin, viewController.getMe)
route.get('/set_user', userController.protect, userController.isLogin, viewController.setUser)
route.get('/set_infor', userController.protect, userController.isLogin, viewController.setInfo)
route.get('/set_edu', userController.protect, userController.isLogin, viewController.setEdu)
route.get('/message', userController.protect, userController.isLogin, viewController.message)
route.get('/search', userController.isLogin, viewController.searchPage)
route.get('/get_cv', userController.get_cv);
route.get('/:slug', userController.isLogin, viewController.getUserSlug)
route.get('/', userController.isLogin, viewController.welcome)

module.exports = route;