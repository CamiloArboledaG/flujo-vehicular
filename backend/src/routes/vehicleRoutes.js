const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, vehicleController.registerVehicle);
router.get('/', vehicleController.getVehicles);
router.get('/status', vehicleController.getVehiclesWithLastSensorData);

module.exports = router;
