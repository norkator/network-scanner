const INTERNAL_SERVER_ERROR = 500;
const BAD_REQUEST = 400;

async function Api(router, sequelize) {


  /**
   * Small table results viewer
   */
  router.get('/', async function (req, res) {
    const results = await sequelize.Result.findAll();
    let str = '<table>\n' +
      '  <tr>\n' +
      '    <th>ScanId</th>\n' +
      '    <th>IP</th>\n' +
      '    <th>Port</th>\n' +
      '  </tr>\n';
    results.forEach(result => {
      str = str + '<tr>\n' +
        '    <td>' + result.scanId + '</td>\n' +
        '    <td><a target="_blank" href="http://' + result.ip + '">http://' + result.ip + '</a></td>\n' +
        '    <td>' + result.port + '</td>\n' +
        '  </tr>\n'
    });
    res.send(str + '</table>')
  });

  /**
   * @swagger
   * /ports:
   *    get:
   *      tags:
   *      - "Ports"
   *      summary: Get added ports used for scanning
   *      description: ""
   *      responses:
   *        '200':
   *          description: OK
   */
  router.get('/ports', async function (req, res) {
    const ports = await sequelize.Port.findAll({
      // order: [
      //   ['id', 'DESC'],
      // ],
      raw: true,
    });
    res.json(ports);
  });

  /**
   * @swagger
   * /ports:
   *    post:
   *      tags:
   *      - "Ports"
   *      summary: Create port which is used for scanning
   *      description: ""
   *      produces:
   *          - application/json
   *      consumes:
   *          - application/json
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                port:
   *                  type: string
   *                port_description:
   *                  type: string
   *              example:
   *                port: 80
   *                port_description: HTTP Protocol
   *        responses:
   *        '200':
   *          description: OK
   */
  router.post('/ports', async function (req, res) {
    try {
      const port = req.body.port;
      const port_description = req.body.port_description;
      const enabled = req.body.enabled;
      const inserted = await sequelize.Port.create({
        port: port,
        port_description: port_description,
        enabled: enabled,
      });
      res.json({id: inserted.id});
    } catch (e) {
      res.status(INTERNAL_SERVER_ERROR);
      res.send(e);
    }
  });

  /**
   * @swagger
   * /ports:
   *    put:
   *      tags:
   *      - "Ports"
   *      summary: Update port with new configuration
   *      produces:
   *          - application/json
   *      consumes:
   *          - application/json
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                id:
   *                  type: number
   *                port:
   *                  type: string
   *                enabled:
   *                  type: boolean
   *                port_description:
   *                  type: string
   *              required:
   *                - id
   *                - port
   *                - enabled
   *                - port_description
   *              example:
   *                id: 1
   *                port: 80
   *                enabled: true
   *                port_description: HTTP Protocol
   *        responses:
   *        '200':
   *          description: OK
   */
  router.put('/ports', async function (req, res) {
    try {
      const id = req.body.id;
      const port = req.body.port;
      const enabled = req.body.enabled;
      const port_description = req.body.port_description;
      if (id === undefined) {
        res.status(BAD_REQUEST);
        res.send('port attribute \'id\' is missing!')
      } else {
        const updated = await sequelize.Port.update({
          port: port,
          enabled: enabled,
          port_description: port_description,
        }, {where: {id: id}});
        res.json({updated: updated[0] === 1});
      }
    } catch (e) {
      res.status(INTERNAL_SERVER_ERROR);
      res.send(e);
    }
  });

    /**
   * @swagger
   * /scans:
   *    delete:
   *      tags:
   *      - "Ports"
   *      summary: Delete a port data
   *      description: ""
   *      produces:
   *          - application/json
   *      consumes:
   *          - application/json
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                id:
   *                  type: number
   *              required:
   *                - id
   *              example:
   *                id: 1
   *      responses:
   *        '200':
   *          description: OK
   */
     router.delete('/ports', async function (req, res) {
      const portId = req.body.portId;
      const w = portId === undefined ? {} : {id: portId};
      const deleted = await sequelize.Port.destroy({
        raw: true,
        where: w,
      });
      res.json({id: deleted.id});
    });

  /**
   * @swagger
   * /scans:
   *    get:
   *      tags:
   *      - "Scans"
   *      summary: Get configured scans
   *      description: ""
   *      responses:
   *        '200':
   *          description: OK
   */
  router.get('/scans', async function (req, res) {
    const scans = await sequelize.Scan.findAll({
      // order: [
      //   ['id', 'DESC'],
      // ],
      raw: true,
    });
    res.json(scans);
  });

  /**
   * @swagger
   * /scans:
   *    post:
   *      tags:
   *      - "Scans"
   *      summary: Create configured scan
   *      description: ""
   *      produces:
   *          - application/json
   *      consumes:
   *          - application/json
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                ip_start:
   *                  type: string
   *                ip_end:
   *                  type: string
   *                enabled:
   *                  type: boolean
   *              example:
   *                ip_start: 192.168.1.1
   *                ip_end: 192.168.1.254
   *                enabled: true
   *        responses:
   *        '200':
   *          description: OK
   */
  router.post('/scans', async function (req, res) {
    try {
      const ip_start = req.body.ip_start;
      const ip_end = req.body.ip_end;
      const enabled = req.body.enabled;
      const inserted = await sequelize.Scan.create({
        ip_start: ip_start,
        ip_end: ip_end,
        enabled: enabled,
      });
      res.json({id: inserted.id});
    } catch (e) {
      res.status(INTERNAL_SERVER_ERROR);
      res.send(e);
    }
  });

  /**
   * @swagger
   * /scans:
   *    put:
   *      tags:
   *      - "Scans"
   *      summary: Update configured scan
   *      description: ""
   *      produces:
   *          - application/json
   *      consumes:
   *          - application/json
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                id:
   *                  type: number
   *                ip_start:
   *                  type: string
   *                ip_end:
   *                  type: string
   *                enabled:
   *                  type: boolean
   *                finished:
   *                  type: boolean
   *              required:
   *                - id
   *                - ip_start
   *                - ip_end
   *                - enabled
   *                - finished
   *              example:
   *                id: 1
   *                ip_start: 192.168.1.1
   *                ip_end: 192.168.1.254
   *                enabled: true
   *                finished: false
   *      responses:
   *        '200':
   *          description: OK
   */
  router.put('/scans', async function (req, res) {
    try {
      const id = req.body.id;
      const ip_start = req.body.ip_start;
      const ip_end = req.body.ip_end;
      const enabled = req.body.enabled;
      const finished = req.body.finished;
      if (id === undefined) {
        res.status(BAD_REQUEST);
        res.send('scan attribute \'id\' is missing!')
      } else {
        const updated = await sequelize.Scan.update({
          ip_start: ip_start,
          ip_end: ip_end,
          enabled: enabled,
          finished: finished,
        }, {where: {id: id}});
        res.json({updated: updated[0] === 1});
      }
    } catch (e) {
      res.status(INTERNAL_SERVER_ERROR);
      res.send(e);
    }
  });

  /**
   * @swagger
   * /scans:
   *    delete:
   *      tags:
   *      - "Scans"
   *      summary: Delete a scan data
   *      description: ""
   *      produces:
   *          - application/json
   *      consumes:
   *          - application/json
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                id:
   *                  type: number
   *              required:
   *                - id
   *              example:
   *                id: 1
   *      responses:
   *        '200':
   *          description: OK
   */
  router.delete('/scans', async function (req, res) {
    const scanId = req.body.scanId;
    const w = scanId === undefined ? {} : {id: scanId};
    const deleted = await sequelize.Scan.destroy({
      raw: true,
      where: w,
    });
    res.json({id: deleted.id});
  });

  /**
   * @swagger
   * /results:
   *    get:
   *      tags:
   *      - "Results"
   *      summary: Get results
   *      description: "Pass no query parameter will return all. Giving query parameter will return only those with provided id"
   *      parameters:
   *        - in: query
   *          name: scanId
   *          schema:
   *            type: number
   *            example: 1
   *      responses:
   *        '200':
   *          description: OK
   */
  router.get('/results', async function (req, res) {
    const scanId = req.query.scanId;
    const w = scanId === undefined ? {} : {scanId: scanId};
    const ports = await sequelize.Result.findAll({
      raw: true,
      where: w,
    });
    res.json(ports);
  });

}

exports.Api = Api;
