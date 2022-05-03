const mongoose = require('mongoose');

const eduSchema = new mongoose.Schema({
    qualification: {
        type: String
    },
    post: {
        type: String
    },
    language: {
        type: String
    },
    aboutBonus: {
        type: [Object]
    },
    accomplishment: {
        type: [Object]
    },
    experiance: {
        type: [Object]
    },
    education: {
        type: [Object]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
module.exports = mongoose.model('Edu', eduSchema);