module.exports = (sequelize, type) => {
  return sequelize.define('scan', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    ip_start: {
      type: type.STRING,
      allowNull: false,
      unique: true,
      defaultValue: '0.0.0.0',
    },
    ip_end: {
      type: type.STRING,
      allowNull: false,
      unique: true,
      defaultValue: '0.0.0.0',
    },
    enabled: {
      type: type.BOOLEAN,
      defaultValue: true,
    },
    finished: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
  })
};
