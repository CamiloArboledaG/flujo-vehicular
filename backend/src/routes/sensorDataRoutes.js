const express = require('express');
const router = express.Router();
const sensorDataController = require('../controllers/sensorDataController');

router.post('/', sensorDataController.ingestSensorData);

module.exports = router;
