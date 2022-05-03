const User = require('./../modals/userModal')
const Edu = require('./../modals/eduModal')
exports.getMe = async (req, res, next) => {
    const user = await User.findById(req.user._id).populate({ path: 'edu' });
    if (!user) return res.send('Email, Password is incorrect');
    res.render('pages/homeUser', { user });
}
exports.login = async (req, res, next) => {
    res.render('pages/loginPage');
}
exports.signup = async (req, res, next) => {
    res.render('pages/signupPage');
}
exports.setUser = async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.send('Email, Password is incorrect');
    res.render('pages/setUserPage', { user });
}
exports.setInfo = async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.send('Email, Password is incorrect');
    res.render('pages/setInforPage', { user });
}
exports.setEdu = async (req, res, next) => {
    const edu = await Edu.findOne({ user: req.user._id });
    if (!edu) return res.send('Email, Password is incorrect');
    res.render('pages/setEduPage', { edu, user: req.user });
}
exports.message = async (req, res, next) => {
    res.render('pages/message');
}
exports.searchPage = async (req, res, next) => {
    const users = await User.find({
        name: { $regex: req.query.searchField, $options: '$i' }
    }).populate({ path: 'edu' });
    res.render('pages/searchPage', { users });
}
exports.getUserSlug = async (req, res, next) => {
    const user = await User.findOne({ slug: req.params.slug }).populate({ path: 'edu' });
    res.render('pages/homeUser', { user })
}
exports.welcome = async (req, res, next) => {
    res.render('pages/welcome');
}