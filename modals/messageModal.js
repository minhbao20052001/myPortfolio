const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: {
        type: String
    },
    fromUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    toUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    status: {
        type: String
    },
    room: {
        type: String,
        default: null
    },
    create: {
        type: Date,
        default: Date.now()
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
module.exports = mongoose.model('Message', messageSchema);