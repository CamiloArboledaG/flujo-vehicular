const db = require('../config/database');

const vehicles = [
  { license_plate: 'TXD-588', model: 'Kenworth T680' },
  { license_plate: 'RPL-912', model: 'Freightliner Cascadia' },
  { license_plate: 'MNN-345', model: 'Volvo VNL 860' },
];

const sensorReadings = [
  // Datos para el vehículo 1
  { vehicle_id: 1, latitude: 4.60971, longitude: -74.08175, fuel_level: 85.5, temperature: 14.5 },
  { vehicle_id: 1, latitude: 4.61971, longitude: -74.09175, fuel_level: 82.1, temperature: 15.0 },
  // Datos para el vehículo 2
  { vehicle_id: 2, latitude: 5.60971, longitude: -74.08175, fuel_level: 90.0, temperature: 22.3 },
  { vehicle_id: 2, latitude: 5.61971, longitude: -74.09175, fuel_level: 88.2, temperature: 21.9 },
  // Datos para el vehículo 3
  { vehicle_id: 3, latitude: 6.61971, longitude: -74.00597, fuel_level: 65.2, temperature: 18.1 },
];

function seed() {
  db.serialize(() => {
    // Insertar Vehículos
    const vehicleStmt = db.prepare('INSERT INTO vehicles (license_plate, model) VALUES (?, ?)');
    console.log('Insertando vehículos...');
    vehicles.forEach((v) => {
      vehicleStmt.run(v.license_plate, v.model, (err) => {
        if (err && !err.message.includes('UNIQUE constraint failed')) {
          console.error('Error insertando vehículo:', err.message);
        }
      });
    });
    vehicleStmt.finalize();
    console.log('Vehículos insertados.');

    // Insertar Datos de Sensores
    const sensorStmt = db.prepare(
      'INSERT INTO sensor_data (vehicle_id, latitude, longitude, fuel_level, temperature) VALUES (?, ?, ?, ?, ?)'
    );
    console.log('Insertando datos de sensores...');
    sensorReadings.forEach((s) => {
      sensorStmt.run(s.vehicle_id, s.latitude, s.longitude, s.fuel_level, s.temperature, (err) => {
        if (err) {
          console.error('Error insertando datos de sensor:', err.message);
        }
      });
    });
    sensorStmt.finalize();
    console.log('Datos de sensores insertados.');
  });

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Base de datos cerrada. Proceso de seeding completado.');
  });
}

seed();
