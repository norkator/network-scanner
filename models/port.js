module.exports = (sequelize, type) => {
  return sequelize.define('port', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    port: {
      type: type.STRING,
      allowNull: false,
      unique: true,
      defaultValue: '0',
    },
    enabled: {
      type: type.BOOLEAN,
      defaultValue: true,
    },
    port_description: {
      type: type.STRING,
      allowNull: false,
    },
  })
};
