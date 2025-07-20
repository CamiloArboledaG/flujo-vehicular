const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, vehicleController.registerVehicle);
router.get('/', authMiddleware, vehicleController.getVehicles);
router.get('/status', authMiddleware, vehicleController.getVehiclesWithLastSensorData);

module.exports = router;
