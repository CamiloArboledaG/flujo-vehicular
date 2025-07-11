const express = require('express');
const vehicleRoutes = require('./routes/vehicleRoutes');
const sensorDataRoutes = require('./routes/sensorDataRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());

// Montar las rutas
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/sensor-data', sensorDataRoutes);

module.exports = app;
