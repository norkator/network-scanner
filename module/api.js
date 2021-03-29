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
   *      responses:
   *        '200':
   *          description: OK
   */
  router.post('/ports', async function (req, res) {
    res.json({status: 'not implemented'});
  });

  /**
   * @swagger
   * /ports:
   *    put:
   *      tags:
   *      - "Ports"
   *      summary: Update port with new configuration
   *      description: ""
   *      responses:
   *        '200':
   *          description: OK
   */
  router.put('/ports', async function (req, res) {
    res.json({status: 'not implemented'});
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
