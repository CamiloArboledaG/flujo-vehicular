const express = require('express');
const router = express.Router();
const sensorDataController = require('../controllers/sensorDataController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', sensorDataController.ingestSensorData);
router.get('/:vehicle_id', authMiddleware, sensorDataController.getAllSensorDataByVehicleId);

module.exports = router;
