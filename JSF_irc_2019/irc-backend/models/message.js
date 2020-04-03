module.exports = (sequelize, type) => {
  return sequelize.define('message', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content: type.STRING,
    user: type.STRING,
    channel: {
      type: type.INTEGER,
      allowNull: false
    }
  })
}