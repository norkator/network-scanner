module.exports = (sequelize, type) => {
  return sequelize.define('result', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    scanId: {
      type: type.BIGINT,
      references: {
        model: 'scans',
        key: 'id',
      }
    },
    ip: {
      type: type.STRING,
      allowNull: false,
    },
    port: {
      type: type.STRING,
      allowNull: false,
    },
    status: {
      type: type.STRING,
      allowNull: false,
    },
    banner: {
      type: type.STRING,
    },
  })
};
