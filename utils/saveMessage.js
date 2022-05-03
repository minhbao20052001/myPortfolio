const Message = require('./../modals/messageModal');
const User = require('./../modals/userModal');
var arr_socket = [];
exports.saveMessage = async (obj) => {
    const msg = await Message.create(obj);
}
exports.saveStatusUser = async (user_id, socket_id, mode) => {
    if (mode == 'on') {
        await User.findByIdAndUpdate(user_id, { socket_id: socket_id })
    } else {
        await User.findByIdAndUpdate(user_id, { socket_id: 'No_connection' })
    }
}
exports.findSocketId = async (id) => {
    return await User.findById(id).select('socket_id');
}
// exports.saveStatusUser = async 
// }
