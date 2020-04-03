const { Message } = require('../models/ModelManager');

function create_message(user, message, channel_id) {
  return Message.create({ user: user, channel: channel_id, content: message })
    .then(() => {
      Message.sync()
    })
    .catch(error => {
      throw (error);
    })
}

function get_messages_by_channel(channel_id) {
  return Message.findAll({
    where:
    {
      channel: channel_id,
    },
    order: [
      ['updatedAt', 'ASC']
    ]
  })
    .then((messages) => {
      return messages
    })
    .catch(error => {
      throw error;
    })
}

module.exports = {
  create_message: create_message,
  get_messages_by_channel: get_messages_by_channel
};