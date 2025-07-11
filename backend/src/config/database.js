const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '..', 'database.db');
const db = new sqlite3.Database(dbPath);

// Usar serialize para asegurar que las tablas se creen en orden
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )`,
    (err) => {
      if (err) {
        console.error('Error al crear la tabla users:', err.message);
      }
    }
  );

  // Crear tabla de vehículos si no existe
  db.run(
    `CREATE TABLE IF NOT EXISTS vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        license_plate TEXT NOT NULL UNIQUE,
        model TEXT
    )`,
    (err) => {
      if (err) {
        console.error('Error al crear la tabla vehicles:', err.message);
      }
    }
  );

  // Crear tabla para datos de sensores si no existe
  db.run(
    `CREATE TABLE IF NOT EXISTS sensor_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        fuel_level REAL NOT NULL,
        temperature REAL NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    )`,
    (err) => {
      if (err) {
        console.error('Error al crear la tabla sensor_data:', err.message);
      }
    }
  );
});

console.log('Conectado a la base de datos SQLite y tablas aseguradas.');

module.exports = db;
