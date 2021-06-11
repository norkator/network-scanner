'use strict';

const torRequest = require('tor-request');
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


/**
 * Scan given host with tor
 * @param {object} sequelize of database table objects
 * @param {number} scanId of scan task
 * @param {string} targetIp of host
 * @param {string} ports in form of 22,80,443
 * @return {Promise<boolean>}
 * @constructor
 */
exports.TorScanIp = async function (sequelize, scanId, targetIp, ports) {
  const portsArray = ports.split(',');
  for (const port of portsArray) {
    torScanPromise(targetIp, port, scanId).then((res) => {
      sequelize.Result.create({
        scanId: res.scanId,
        ip: res.targetIp,
        port: res.port,
        status: 'open',
        banner: null,
      });
    }).catch(() => null);
  }
  return true;
};


function torScanPromise(targetIp, port, scanId) {
  return new Promise((resolve, reject) => {
    const options = {
      url: 'http://' + targetIp /*/ + ':' + port*/,
      // timeout: 500
    };
    torRequest.request(options, function (err, res, body) {
      if (!err && res.statusCode === 200) {
        logger.log(body, logger.LOG_GREEN);
        resolve({scanId: scanId, targetIp: targetIp, port: port});
      } else {
        // logger.log(err, logger.LOG_RED);
        reject();
      }
    });
  });
}
