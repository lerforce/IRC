const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {origins: '*:*'});
const { client_connect, client_disconnect } = require('./socket_controller/user_controller');
const {
  client_channel_message,
  create_channel,
  get_channels,
  get_messages_of_channel
} = require('./socket_controller/channel_controller');


server.listen(3000, console.log("irc-server running"));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

//io gesture

io.on('connection', function (socket) {
  client_connect(socket);
  client_disconnect(socket);
  client_channel_message(socket, io);
  create_channel(socket);
  get_channels(socket);
  get_messages_of_channel(socket);
});

io.on('disconnect', function (socket) {
  // socket.on('disconnect')
  console.log(">> io on disconnect");
});