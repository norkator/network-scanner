'use strict';

const evilScan = require('evilscan');
const logger = require('./logger');

/**
 * Scan given host
 * @param {object} sequelize of database table objects
 * @param {number} scanId of scan task
 * @param {string} targetIp of host
 * @param {string} ports in form of 22,80,443
 * @return {Promise<boolean>}
 * @constructor
 */
exports.ScanIp = async function (sequelize, scanId, targetIp, ports) {
  const options = {
    target: targetIp,
    port: ports,
    status: 'O', // Default: TROU => Timeout, Refused, Open, Unreachable
    banner: true
  };
  new evilScan(options, async function (error, scan) {
    scan.on('result', data => {
      if (data.status === 'open') {
        logger.log(data, logger.LOG_GREEN);
        sequelize.Result.create({
          scanId: scanId,
          ip: data.ip,
          port: data.port,
          status: data.status,
          banner: data.banner,
        }).then(() => null);
      } else {
        logger.log(data, logger.LOG_RED);
      }
    });

    scan.run();
  });
  return true;
};
