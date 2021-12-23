'use strict';

const path = require('path')
const database = require('./module/database');
const range = require('ip-range-generator');
const schedule = require('node-schedule');
const scanner = require('./module/scanner');
const logger = require('./module/logger');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const packageJson = require('./package');


const timeout = ms => new Promise(res => setTimeout(res, ms));
const scanDelayMs = Number(process.env.SCAN_DELAY_MS);
let scanRunning = false;

const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: packageJson.description,
			version: packageJson.version,
		},
	},
	apis: ['./module/api.js'],
};

app.get('/index', (req, res) => {
	res.sendFile('ui/index.html', {
		root: path.join(__dirname, './')
	});
});

// Check database existence
database.DatabaseExists().then(async () => {
	const sequelize = require('./module/sequelize');

	// init api
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true, }));
	const swaggerSpec = swaggerJsdoc(swaggerOptions);
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
	require('./module/api').Api(app, sequelize); // add routes
	app.use(function (req, res, next) {
		logger.log(req.method + req.url, logger.LOG_UNDERSCORE);
		next();
	});
	// app.listen(process.env.API_PORT, () => {
	// 	logger.log(`API listening on port http://localhost:${process.env.API_PORT}/`, logger.LOG_YELLOW);
	// 	logger.log(`API documentation at http://localhost:${process.env.API_PORT}/api-docs`, logger.LOG_YELLOW);
	// });


	// Repeat with scheduler
	// await RunScans(sequelize); // run immediately
	// schedule.scheduleJob('* /30 * * * *', async () => {
	// 	if (!scanRunning) {
	// 		await RunScans(sequelize);
	// 	}
	// });
});


/**
 * Run scans
 * @param {Object} sequelize db objects
 * @return {Promise<void>}
 * @constructor
 */
async function RunScans(sequelize) {
	const torScanEnabled = process.env.USE_TOR === 'true';
	const ports = await GetPorts(sequelize);
	if (ports != null) {
		const scans = await GetScans(sequelize);
		if (scans.length === 0) {
			logger.log('No scan tasks', logger.LOG_YELLOW);
		}
		scanRunning = true;
		for (let scan of scans) {
			for (let ip of range(String(scan.ip_start), String(scan.ip_end))) {
				logger.log('Scanning ' + String(ip) + (torScanEnabled ? ' (tor)' : ''), logger.LOG_DEFAULT);
				if (torScanEnabled) {
					await scanner.TorScanIp(sequelize, Number(scan.id), ip, ports);
				} else {
					await scanner.ScanIp(sequelize, Number(scan.id), ip, ports);
				}
				await timeout(scanDelayMs);
			}
			await SetScanFinished(sequelize, Number(scan.id));
		}
		scanRunning = false;
	} else {
		logger.log('No enabled ports for scanning!', logger.LOG_RED);
	}
}


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
	return await sequelize.Scan.update({ finished: true }, { where: { id: scanId } });
}


app.listen(process.env.API_PORT, () => {
	logger.log(`API listening on port http://localhost:${process.env.API_PORT}/`, logger.LOG_YELLOW);
	logger.log(`API documentation at http://localhost:${process.env.API_PORT}/api-docs`, logger.LOG_YELLOW);
});