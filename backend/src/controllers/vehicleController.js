const db = require('../config/database');

// Función para enmascarar la matrícula
function maskLicensePlate(plate) {
  if (!plate || plate.length < 4) {
    return plate;
  }
  // Muestra los primeros 3 caracteres y el último caracter
  return `${plate.substring(0, 3)}****${plate.substring(plate.length - 1)}`;
}

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

exports.getVehicles = (req, res) => {
  const sql = `SELECT * FROM vehicles`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).send({ error: 'No se pudo obtener los vehículos.' });
    }

    // Si el usuario no es admin, enmascaramos la matrícula
    if (!req.user.admin) {
      rows.forEach((row) => {
        row.license_plate = maskLicensePlate(row.license_plate);
      });
    }

    res.status(200).json(rows);
  });
};

exports.getVehiclesWithLastSensorData = (req, res) => {
  const sql = `
    SELECT
      v.id,
      v.license_plate,
      v.model,
      sd.latitude,
      sd.longitude,
      sd.fuel_level,
      sd.temperature,
      sd.timestamp
    FROM vehicles v
    LEFT JOIN (
      SELECT
        s.*
      FROM sensor_data s
      INNER JOIN (
        SELECT
          vehicle_id,
          MAX(timestamp) AS max_timestamp
        FROM sensor_data
        GROUP BY vehicle_id
      ) AS latest ON s.vehicle_id = latest.vehicle_id AND s.timestamp = latest.max_timestamp
    ) AS sd ON v.id = sd.vehicle_id
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error al obtener el estado de los vehículos:', err.message);
      return res.status(500).json({ error: 'No se pudo obtener el estado de los vehículos.' });
    }

    // Si el usuario no es admin, enmascaramos la matrícula
    if (!req.user.admin) {
      rows.forEach((row) => {
        row.license_plate = maskLicensePlate(row.license_plate);
      });
    }

    res.status(200).json(rows);
  });
};
