const Sequelize = require('sequelize');
const UserModel = require('./user');
const ChannelModel = require('./channel');
const MessageModel = require('./message');

const sequelize = new Sequelize('irc', 'eloi', 'eloi',
  {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
      max: 20,
      min: 0,
      idle: 10000,
    },
    logging: false
  });

const User = UserModel(sequelize, Sequelize);
const Channel = ChannelModel(sequelize, Sequelize);
const Message = MessageModel(sequelize, Sequelize);

sequelize.sync()
  .then(() => {
    console.log(`Database & tables up to date.`)
  })
  .catch((error) => {
    throw error;
  })

// Channel.create({channel_name: 'all'})
// .then(() => {
//   Channel.sync()
// })

// Message.create({user: "test", content: 'hello_world', channel: 1})
// .then(() => {
//   Message.sync()
// })

module.exports = {
  User,
  Channel,
  Message
}