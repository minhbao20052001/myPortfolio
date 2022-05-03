const jwt = require('jsonwebtoken');
const User = require('./../modals/userModal')
const Edu = require('./../modals/eduModal')
const { promisify } = require('util');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
//multer for photo
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('I don\'t have a clue!'), false);
    }
}
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})
exports.uploadUserPhoto = upload.fields([{
    name: 'photo', maxCount: 1
}, {
    name: 'background', maxCount: 1
}]);
//multer for cv
const storage_cv = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/files")
    },
    filename: (req, file, cb) => {
        req.body.filename = `cv-${req.user._id}-${Date.now()}.pdf`;
        cb(null, req.body.filename)
    }
})
const multerFilter_cv = (req, file, cb) => {
    if (file.mimetype.startsWith('application/pdf')) {
        cb(null, true);
    } else {
        cb(new Error('I don\'t have a clue!'), false);
    }
}
const upload_cv = multer({
    storage: storage_cv,
    fileFilter: multerFilter_cv
})
exports.uploadUserCv = upload_cv.single('cv');
exports.updateUserCv = async (req, res, next) => {
    if (req.body.filename) {
        if (req.user.cv) fs.unlinkSync(`public/files/${req.user.cv}`);
        const user = await User.findOneAndUpdate({ _id: req.user._id }, {
            cv: req.body.filename
        }, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: 'success'
        })
    } else {
        res.status(200).json({
            status: 'Fail'
        })
    }

}
exports.resizeUserPhoto = async (req, res, next) => {
    if (!req.files.background && !req.files.photo) return next();
    if (req.files.photo) {
        req.body.photoName = `user-${req.user._id}-${Date.now()}.jpeg`;
        await sharp(req.files.photo[0].buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/${req.body.photoName}`);
    }
    if (req.files.background) {
        req.body.backgroundName = `bg-${req.user._id}-${Date.now()}.jpeg`;
        await sharp(req.files.background[0].buffer)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/${req.body.backgroundName}`);
    }
    next();
}
exports.getAllUser = async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'Success',
        data: users
    })
}
exports.signUpUser = async (req, res, next) => {
    const userNew = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })
    const edu = await Edu.create({
        user: userNew._id
    })
    const token = jwt.sign({ _id: userNew._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIREs_IN
    })

    opt = {
        expire: new Date(Date.now() + process.env.JWT_EXPIREs_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if (process.env.NODE_ENV == 'production') opt.secure = true;
    res.cookie('jwt', token, opt)

    userNew.password = undefined;
    res.status(201).json({
        status: 'success',
        token,
        data: userNew
    })
}
exports.signInUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return res.send('Email, Password is incorrect');

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        return res.send('Email, Password is incorrect');
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIREs_IN
    })

    opt = {
        expire: new Date(Date.now() + process.env.JWT_EXPIREs_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if (process.env.NODE_ENV == 'production') opt.secure = true;
    res.cookie('jwt', token, opt)

    user.password = undefined;
    res.status(201).json({
        status: 'success',
        token
    })
}
exports.logout = async (req, res, next) => {
    res.cookie('jwt', '', {
        expires: new Date(Date.now() + 1000),
        httpOnly: true
    })
    res.status(200).json({
        status: 'success'
    })
}
exports.protect = async (req, res, next) => {
    let jwtString;
    if (req.cookies) {
        jwtString = req.cookies.jwt;
    }
    if (!jwtString) return res.send('Email, Password is incorrect');

    const decode = await promisify(jwt.verify)(jwtString, process.env.JWT_SECRET)

    const user = await User.findById(decode._id)
    if (!user) return res.send('Email, Password is incorrect');

    if (!(user.checkChangedPassword(decode.iat) === true)) return res.send('Email, Password is incorrect');

    req.user = user;

    next();
}
exports.updateUser = async (req, res, next) => {
    if (req.body.password) return res.send('Email, Password is incorrect');

    const obj = {
        name: req.body.name,
        email: req.body.email,
        color: req.body.color
    }
    if (req.body.photoName) {
        if (req.user.photo && req.user.photo != 'user_default.png') fs.unlinkSync(`public/img/${req.user.photo}`)
        obj.photo = req.body.photoName;
    }
    if (req.body.backgroundName) {
        if (req.user.background) fs.unlinkSync(`public/img/${req.user.background}`)
        obj.background = req.body.backgroundName;
    }

    const user = await User.findOneAndUpdate({ _id: req.user._id }, obj, {
        new: true,
        runValidators: true
    })
    if (!user) return res.send('Email, Password is incorrect');

    res.status(200).json({
        status: 'success',
        data: user
    })
}
exports.getMe = async (req, res, next) => {
    const user = await User.findById(req.user._id).populate({ path: 'edu' });
    if (!user) return res.send('Email, Password is incorrect');

    res.status(200).json({
        status: 'success',
        data: user
    })
}
exports.isLogin = async (req, res, next) => {
    if (!req.cookies.jwt) return next();
    try {
        const decode = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        if (!decode) return next();
        const user = await User.findById(decode._id);
        if (!user) return next();
        if (!(user.checkChangedPassword(decode.iat) === true)) return next();
        res.locals.locals_user = user;
        return next();
    } catch (error) {
        return next();
    }
    next();
}
exports.updateInfor = async (req, res, next) => {
    const { age, phone, address, socialNetwork, intro } = req.body;
    const user = await User.findOneAndUpdate({ _id: req.user._id }, { age, phone, address, socialNetwork, intro }, {
        new: true,
        runValidators: true
    })
    if (!user) return res.send('Email, Password is incorrect');

    res.status(201).json({
        status: 'success',
        data: user
    })
}
exports.getStatus = async (req, res, next) => {
    const status = await User.findById(req.params.id).select('socket_id');
    res.status(200).json({
        status: 'success',
        data: status
    })
}
exports.searchUser = async (req, res, next) => {
    const users = await User.find({
        name: { $regex: req.query.searchField, $options: '$i' }
    })
    res.status(200).json({
        status: 'success',
        data: users
    })
}
exports.get_cv = async (req, res, next) => {
    var path = await User.findById(req.query.cv);
    if (!path) return res.send('Email, Password is incorrect');
    res.download(`public/files/${path.cv}`)
}