const db = require('../config/database');

exports.registerVehicle = (req, res) => {
  const { license_plate, model } = req.body;
  if (!license_plate) {
    return res.status(400).send({ error: 'La matrícula (license_plate) es requerida.' });
  }

  const sql = `INSERT INTO vehicles (license_plate, model) VALUES (?, ?)`;
  db.run(sql, [license_plate, model], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).send({ error: `El vehículo con matrícula '${license_plate}' ya existe.` });
      }
      console.error('Error al insertar vehículo:', err.message);
      return res.status(500).send({ error: 'No se pudo registrar el vehículo.' });
    }
    res.status(201).json({
      message: 'Vehículo registrado exitosamente',
      vehicleId: this.lastID,
    });
  });
};
