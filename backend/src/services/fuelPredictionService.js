const db = require('../config/database');
const { broadcast } = require('../websocket');

/**
 * Analiza los datos de un vehículo para determinar si tiene baja autonomía de combustible.
 * @param {object} currentReading - La lectura de sensor más reciente que acaba de ser insertada.
 * @param {number} currentReading.vehicle_id - El ID del vehículo.
 * @param {number} currentReading.fuel_level - El nivel de combustible actual.
 */
function checkFuelAutonomy(currentReading) {
  // Para calcular un ratio, necesitamos al menos dos puntos de datos.
  // Obtenemos las 2 últimas lecturas del vehículo, incluyendo la actual.
  const sql = `SELECT * FROM sensor_data WHERE vehicle_id = ? ORDER BY timestamp DESC LIMIT 2`;

  db.all(sql, [currentReading.vehicle_id], (err, rows) => {
    if (err) {
      console.error('Error al obtener datos para predicción:', err.message);
      return;
    }

    // Si tenemos menos de 2 lecturas, no podemos calcular un consumo.
    if (rows.length < 2) {
      console.log(`No hay suficientes datos para el vehículo ${currentReading.vehicle_id} para calcular la autonomía.`);
      return;
    }

    const [latestReading, previousReading] = rows;

    // Calculamos la diferencia de combustible y tiempo.
    // El tiempo se convierte de milisegundos a horas.
    const fuelConsumed = previousReading.fuel_level - latestReading.fuel_level;
    const timeElapsedHours =
      (new Date(latestReading.timestamp) - new Date(previousReading.timestamp)) / (1000 * 60 * 60);

    // Si no ha pasado tiempo o si el combustible aumentó (recarga), no podemos calcular.
    if (timeElapsedHours <= 0 || fuelConsumed < 0) {
      if (fuelConsumed < 0) console.log(`Vehículo ${currentReading.vehicle_id} ha recargado combustible.`);
      return;
    }

    // Si el vehículo está detenido (mismo nivel de combustible), la autonomía es infinita.
    if (fuelConsumed === 0) {
      return;
    }

    // Calculamos el ratio de consumo (e.g., litros por hora).
    const consumptionRatePerHour = fuelConsumed / timeElapsedHours;

    // Calculamos la autonomía restante en horas.
    const remainingAutonomyHours = latestReading.fuel_level / consumptionRatePerHour;

    console.log(
      `Vehículo ${currentReading.vehicle_id}: Autonomía restante estimada: ${remainingAutonomyHours.toFixed(2)} horas.`
    );

    // La condición de alerta.
    if (remainingAutonomyHours < 1) {
      const alertPayload = {
        vehicle_id: latestReading.vehicle_id,
        remainingAutonomyHours: remainingAutonomyHours,
        message: `Vehículo ${latestReading.vehicle_id} tiene menos de 1 hora de autonomía.`,
      };

      console.warn(`*** ALERTA EMITIDA ***`, alertPayload.message);

      // Transmitir la alerta a todos los clientes conectados
      broadcast({
        type: 'FUEL_ALERT',
        payload: alertPayload,
      });
    }
  });
}

module.exports = {
  checkFuelAutonomy,
};
