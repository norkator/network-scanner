'use strict';

const logger = require('./logger');
const Sequelize = require('sequelize');
const dotEnv = require('dotenv');
dotEnv.config();


// Models
const PortModel = require('../models/port');
const ResultModel = require('../models/result');
const ScanModel = require('../models/scan');


// Sequelize instance
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  },
  logging: false,
});


// Initialize models
const Port = PortModel(sequelize, Sequelize);
const Result = ResultModel(sequelize, Sequelize);
const Scan = ScanModel(sequelize, Sequelize);


// Relations
Scan.hasMany(Result);


// Sync with database
sequelize.sync().then(() => {
  logger.log('db sync finished', logger.LOG_GREEN)
}).catch(() => {
  process.exit(0);
});


// Export models
module.exports = {
  Port,
  Result,
  Scan,
};
