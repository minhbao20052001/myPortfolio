const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is invalid !!!']
    },
    email: {
        type: String,
        required: [true, 'Email is invalid !!!'],
        unique: true,
        lowercase: true,
        validate: validator.isEmail
    },
    photo: {
        type: String,
        default: 'user_default.png'
    },
    cv: {
        type: String
    },
    color: {
        type: String,
        default: 'blue'
    },
    background: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Password is invalid !!!'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Password is invalid !!!'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Password Confirm incorrect !!!'
        }
    },
    intro: {
        type: String
    },
    age: {
        type: String
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    socialNetwork: {
        type: String
    },
    slug: String,
    room: String,
    socket_id: {
        type: String,
        default: 'No_connection',
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpire: Date
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
userSchema.virtual('edu', {
    ref: 'Edu',
    localField: '_id',
    foreignField: 'user'
})
userSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {
        lower: true
    })
    next();
})
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
})
userSchema.methods.correctPassword = function (candidatePassword, userPassword) {
    return bcrypt.compare(candidatePassword, userPassword);
}
userSchema.methods.checkChangedPassword = function (iat) {
    if (!this.passwordChangedAt) return true;
    const time = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    return time < iat;
}
module.exports = mongoose.model('User', userSchema);