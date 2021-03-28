'use strict';

const pgTools = require('pgtools');
const logger = require('./logger');
const dotEnv = require('dotenv');
dotEnv.config();

/**
 * Check database existence
 * @return {Promise<boolean>}
 */
exports.DatabaseExists = async function() {
  return await createDatabase();
};


/**
 * Create database if not exists
 * Todo: fix this mess
 */
async function createDatabase() {
  logger.log('Checking database existence', logger.LOG_GREEN);
  try {
    return await pgTools.createdb({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST
    }, process.env.DB_DATABASE, async function (error, response) {
      if (!error) {
        console.log('Created database ' + process.env.DB_DATABASE);
      }
      return true;
    });
  } catch (e) {
    return true;
  }
}
