module.exports = (sequelize, type) => {
  return sequelize.define('channel', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      channel_name: {
        type: type.STRING,
        unique: true
      }

  })
}