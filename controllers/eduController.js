const Edu = require('./../modals/eduModal');

exports.setUserForEdu = (req, res, next) => {
    if (!req.body.user) req.body.user = req.user._id;
    next();
}

exports.setEdu = async (req, res, next) => {
    const edu = await Edu.create(req.body);
    if (!edu) return res.send('Email, Password is incorrect');
    res.status(201).json({
        status: 'success',
        data: edu
    })
}
exports.updateEdu = async (req, res, next) => {
    const edu = await Edu.findOneAndUpdate({ user: req.user._id }, req.body, {
        new: true,
        runValidators: true
    })
    if (!edu) return res.send('Email, Password is incorrect');

    res.status(201).json({
        status: 'success',
        data: edu
    })
}