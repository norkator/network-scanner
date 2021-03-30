const INTERNAL_SERVER_ERROR = 500;
const BAD_REQUEST = 400;

async function Api(router, sequelize) {

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
      const inserted = await sequelize.Port.create({
        port: port,
        port_description: port_description,
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
    const ports = await sequelize.Scan.findAll({
      raw: true,
    });
    res.json(ports);
  });

  /**
   * @swagger
   * /scans:
   *    post:
   *      tags:
   *      - "Scans"
   *      summary: Create configured scan
   *      description: ""
   *      responses:
   *        '200':
   *          description: OK
   */
  router.post('/scans', async function (req, res) {
    res.json({status: 'not implemented'});
  });

  /**
   * @swagger
   * /scans:
   *    put:
   *      tags:
   *      - "Scans"
   *      summary: Update configured scan
   *      description: ""
   *      responses:
   *        '200':
   *          description: OK
   */
  router.put('/scans', async function (req, res) {
    res.json({status: 'not implemented'});
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
