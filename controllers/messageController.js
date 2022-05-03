const Message = require('./../modals/messageModal');
const User = require('./../modals/userModal');

exports.getListUser = async (req, res, next) => {
    const list_mess = await Message.find({
        $or: [{ fromUser: req.params.id }, { toUser: req.params.id }],
        room: { $eq: null }
    });
    var list_user_id = list_mess.map(e => {
        return e.fromUser.toString() == req.params.id ? e.toUser.toString() : e.fromUser.toString();
    })
    var list_user_id_single = list_user_id.filter((c, index) => {
        return list_user_id.indexOf(c) === index;
    });
    const list_user = await Promise.all(list_user_id_single.map(async (val) => {
        return await User.findById(val).select('photo _id name socket_id');
    }));
    res.status(200).json({
        status: 'success',
        data: list_user
    })
}
exports.getMessageFromUser = async (req, res, next) => {
    const list_mess = await Message.find({
        $or: [{ fromUser: req.params.id, toUser: req.user._id }, { toUser: req.params.id, fromUser: req.user._id }],
        room: { $eq: null }
    }).sort({ create: 1 });
    res.status(200).json({
        status: 'success',
        data: list_mess
    })
}
exports.saveMessage = async (req, res, next) => {
    const isUser = await User.findById(req.body.toUser);
    if (!isUser) return res.status(200).json({
        status: "Fail"
    })
    req.body.fromUser = req.user._id;
    const message = await Message.create(req.body);
    res.status(200).json({
        status: 'success'
    })
}