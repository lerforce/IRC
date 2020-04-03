const { User } = require('../models/ModelManager');

function check_valid_user(user) {
  return User.findAll({
    where: { username: user.username }
  }).then(users => {
    if (users.length > 0)
      return false;
    return true;
  })
}

function check_user_connected(user) {
  return User.findAll({
    where: { username: user }
  })
    .then(users => {
      if (users.length != 1)
        return false;
      return true;
    })
}

function client_connect(socket) {
  socket.on('login', data => {
    const user = {
      username: data.username
    }
    if (!user.username)
      socket.emit('login', { error: "Invalid params" });
    check_valid_user(user).then((response) => {
      if (response === true) {
        User.create({ username: user.username })
          .then(() => {
            User.sync().then(() => {
              console.log("> User connected");
              socket.emit('login', { status: "User connected" })
            })
          })
          .catch(error => {
            socket.emit('login', { status: "Internal error" });
            throw error;
          })
      }
      else {
        socket.emit('login', { status: "username already taken" });
      }
    })
  });
}

function client_disconnect(socket) {
  socket.on('logout', data => {
    const user = {
      username: data.username
    };
    if (!user.username)
      socket.emit('logout', { error: "Invalid params" });
    User.destroy({ where: { username: user.username } })
      .then(() => {
        socket.emit('logout', { status: "disconnected" });
      })
      .catch(error => {
        throw error;
      })
  })
}



module.exports = {
  client_connect: client_connect,
  client_disconnect: client_disconnect,
  check_user_connected: check_user_connected
};