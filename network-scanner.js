'use strict';

const database = require('./module/database');
const range = require('ip-range-generator');
const schedule = require('node-schedule');
const scanner = require('./module/scanner');

const timeout = ms => new Promise(res => setTimeout(res, ms));
const scanDelayMs = Number(process.env.SCAN_DELAY_MS);

// Check database existence
database.DatabaseExists().then(async () => {
  const sequelize = require('./module/sequelize');
  const ports = await sequelize.Port.findAll({
    attributes: [
      'port'
    ],
    where: {
      enabled: true,
    },
    raw: true,
  });


  console.log(ports);

  // Repeat with scheduler
  // schedule.scheduleJob('10 * * * * *', async () => {


  // for (let ip of range('192.168.2.1', '192.168.2.254')) {
  //   await scanner.ScanIp(ip, '3389');
  //   await timeout(scanDelayMs);
  // }

  // });
});
