const express = require('express');
const route = express.Router();

const messageController = require('./../controllers/messageController')
const userController = require('./../controllers/userController')

route.get('/:id', userController.protect, messageController.getListUser);
route.get('/getmessages/:id', userController.protect, messageController.getMessageFromUser)
route.post('/saveMessage', userController.protect, messageController.saveMessage)

module.exports = route;