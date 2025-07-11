const db = require('../config/database');

exports.ingestSensorData = (req, res) => {
  const { vehicle_id, latitude, longitude, fuel_level, temperature } = req.body;

  const errors = [];
  if (vehicle_id == null) errors.push('vehicle_id es requerido');
  if (latitude == null) errors.push('latitude es requerido');
  if (longitude == null) errors.push('longitude es requerido');
  if (fuel_level == null) errors.push('fuel_level es requerido');
  if (temperature == null) errors.push('temperature es requerido');

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const sql = `INSERT INTO sensor_data (vehicle_id, latitude, longitude, fuel_level, temperature) VALUES (?, ?, ?, ?, ?)`;
  const params = [vehicle_id, latitude, longitude, fuel_level, temperature];

  db.run(sql, params, function (err) {
    if (err) {
      if (err.message.includes('FOREIGN KEY constraint failed')) {
        return res.status(400).json({ error: `El vehículo con id '${vehicle_id}' no existe.` });
      }
      console.error('Error al insertar datos de sensor:', err.message);
      return res.status(500).json({ error: 'Error al guardar los datos del sensor.' });
    }
    res.status(201).json({
      message: 'Datos del sensor recibidos y guardados.',
      dataId: this.lastID,
    });
  });
};
