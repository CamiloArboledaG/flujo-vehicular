const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, vehicleController.registerVehicle);
router.get('/', vehicleController.getVehicles);

module.exports = router;
