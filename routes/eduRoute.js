const express = require('express');
const route = express.Router();

const eduController = require('./../controllers/eduController')
const userController = require('./../controllers/userController')

route.post('/set_edu', userController.protect, eduController.setUserForEdu, eduController.setEdu);
route.patch('/update_edu', userController.protect, eduController.updateEdu);

module.exports = route;