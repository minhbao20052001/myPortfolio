const dotenv = require('dotenv');
const http = require('http');
dotenv.config({ path: './config.env' });

const app = require('./app');
const Message = require('./utils/saveMessage');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);

const mongoose = require('mongoose');

// config DB
const DB = process.env.DATABASE.replace('<password>', process.env.PASSWORD);
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}
//Connect DB
// Message.saveMessage({
//   toUser: '62663e5c1f654bde05c686e8',
//   fromUser: '626bf018eb8a6983d39d323f',
//   text: 'abc'
// })
mongoose.connect(DB, connectionParams)
  .then(() => {
    console.log('Connected to database ')
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  })
// socket.io
io.on('connection', socket => {
  //save in database status
  var user_id;
  socket.on("send_user_id", (data) => {
    user_id = data.userid;
    Message.saveStatusUser(user_id, socket.id, 'on');
  })
  socket.on('disconnect', () => {
    Message.saveStatusUser(user_id, socket.id, 'off');
  })

  socket.on('chatMessagePrivate', async data => {
    Message.saveMessage({
      fromUser: data.user_from,
      toUser: data.user_to,
      text: data.text
    })
    var socket_to = await Message.findSocketId(data.user_to);
    socket.broadcast.to(socket_to.socket_id).emit('messagePrivate', data)
  })
})

const port = process.env.PORT || 3000;
const ser = server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});