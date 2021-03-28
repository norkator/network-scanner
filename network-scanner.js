'use strict';

const database = require('./module/database');
const range = require('ip-range-generator');
const schedule = require('node-schedule');
const scanner = require('./module/scanner');
const logger = require('./module/logger');

const timeout = ms => new Promise(res => setTimeout(res, ms));
const scanDelayMs = Number(process.env.SCAN_DELAY_MS);

// Check database existence
database.DatabaseExists().then(async () => {
  const sequelize = require('./module/sequelize');

  // Repeat with scheduler
  // schedule.scheduleJob('10 * * * * *', async () => {

  const ports = await GetPorts(sequelize);
  if (ports != null) {
    const scans = await GetScans(sequelize);
    if (scans.length === 0) {
      logger.log('No scan tasks', logger.LOG_YELLOW);
    }
    for (let scan of scans) {
      for (let ip of range(String(scan.ip_start), String(scan.ip_end))) {
        await scanner.ScanIp(sequelize, Number(scan.id), ip, ports);
        await timeout(scanDelayMs);
      }
      await SetScanFinished(sequelize, Number(scan.id));
    }
  } else {
    logger.log('No enabled ports for scanning!', logger.LOG_RED);
  }

  // });
});


/**
 * Get ports for scanner
 * @param {object} sequelize
 * @return {Promise<string>}
 * @constructor
 */
async function GetPorts(sequelize) {
  const ports_ = await sequelize.Port.findAll({
    attributes: [
      'port'
    ],
    where: {
      enabled: true,
    },
    raw: true,
  });
  let ports = '';
  ports_.forEach(port => {
    ports += port.port + ',';
  });
  return ports.length > 0 ? ports.slice(0, ports.length - 1) : null;
}

/**
 * Get scan tasks
 * @param {object} sequelize
 * @return {Promise<Object[]>}
 * @constructor
 */
async function GetScans(sequelize) {
  return await sequelize.Scan.findAll({
    attributes: [
      'id',
      'ip_start',
      'ip_end',
    ],
    where: {
      enabled: true,
      finished: false,
    },
    raw: true,
  });
}

/**
 * Update scan finished
 * @param {object} sequelize
 * @param {number} scanId
 * @return {Promise<*>}
 * @constructor
 */
async function SetScanFinished(sequelize, scanId) {
  return await sequelize.Scan.update({finished: true}, {where: {id: scanId}});
}
