'use strict';

const evilScan = require('evilscan');
const logger = require('./logger');

/**
 * Scan given host
 * @param {object} sequelize of database table objects
 * @param {string} targetIp of host
 * @param {string} ports in form of 22,80,443
 * @return {Promise<boolean>}
 * @constructor
 */
exports.ScanIp = async function (sequelize, targetIp, ports) {
  const options = {
    target: targetIp,
    port: ports,
    status: 'O', // Default: TROU => Timeout, Refused, Open, Unreachable
    banner: true
  };
  new evilScan(options, async function (error, scan) {
    scan.on('result', data => {
      console.log(data);
    });

    scan.run();
  });
  return true;
};
