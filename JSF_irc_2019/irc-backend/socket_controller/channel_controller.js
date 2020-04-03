const { Channel } = require('../models/ModelManager');
const { create_message, get_messages_by_channel } = require('./message_controller');
const { check_user_connected } = require('./user_controller');

function client_channel_message(socket, io) {
  socket.on('message', data => {
    const channel = data.channel;
    const message = data.message;
    const user = data.username;
    check_user_connected(user)
      .then(is_user_valid => {
        if (!is_user_valid) {
          socket.emit('message', { status: "message cannot be send, user not connected" });
          return;
        }
        Channel.findAll({ where: { channel_name: channel } })
          .then((channels) => {
            if (channels.lenght < 1) {
              socket.emit('message', { status: "message cannot be send, channel don't exists" });
              return;
            }
            create_message(user, message, channels[0].id)
              .then(() => {
                io.emit(channel, { message, user });
              })
          })
          .catch(error => {
            throw error;
          })
      })
  })
}

function create_channel(socket) {
  socket.on('create channel', data => {
    const channel_name = data.channel;
    Channel.findAll({
      where: { channel_name }
    })
      .then((channels) => {
        if (channels.length > 0) {
          console.log("channel[", channel_name, "] already exist");
          socket.emit('create channel', { status: "channel creation failed, channel already exists" })
          return;
        }
        Channel.create({ channel_name: channel_name })
          .then((response) => {
            Channel.sync()
              .then(() => {
                console.log("channel [", channel_name, "] created");
                socket.emit('create channel', { status: "channel creation success" })
              })
              .catch(error => {
                throw error;
              })
          })
          .catch(error => {
            throw error;
          })
      })
      .catch(error => {
        throw error;
      })
  })
}

// TODO => function rename_channel(socket) {

// }

function get_channels(socket) {
  socket.on('get channels', () => {
    Channel.findAll()
      .then((channels) => {
        socket.emit('get channels', { channels });
      })
      .catch(error => {
        throw error;
      })
  })
}

function get_messages_of_channel(socket) {
  socket.on('get messages', data => {
    const channel_name = data.channel
    Channel.findAll({ where: { channel_name: channel_name } })
      .then((channels) => {
        if (channels.length != 1) {
          socket.emit('get messages', { status: 'the channel is invalid' })
          return;
        }
        get_messages_by_channel(channels[0].id)
          .then((messages) => {
            socket.emit('get messages', { messages });
          })
          .catch(error => {
            throw error;
          })
      })
      .catch(error => {
        throw error;
      })
  })
}

module.exports = {
  client_channel_message: client_channel_message,
  create_channel: create_channel,
  get_channels: get_channels,
  get_messages_of_channel: get_messages_of_channel
}