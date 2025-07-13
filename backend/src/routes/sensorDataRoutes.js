const express = require('express');
const router = express.Router();
const sensorDataController = require('../controllers/sensorDataController');

router.post('/', sensorDataController.ingestSensorData);
router.get('/:vehicle_id', sensorDataController.getAllSensorDataByVehicleId);

module.exports = router;
