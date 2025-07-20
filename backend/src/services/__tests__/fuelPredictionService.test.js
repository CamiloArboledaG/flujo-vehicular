const { checkFuelAutonomy } = require('../fuelPredictionService');
const db = require('../../config/database');
const websocket = require('../../websocket');

// Mockear los módulos de la base de datos y websocket
jest.mock('../../config/database', () => ({
  all: jest.fn(),
}));

jest.mock('../../websocket', () => ({
  broadcastToAdmins: jest.fn(),
}));

describe('Fuel Prediction Service', () => {
  // Limpiar los mocks después de cada prueba
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería emitir una alerta si la autonomía es menor a 1 hora', () => {
    const mockRows = [
      {
        vehicle_id: 1,
        license_plate: 'TEST-01',
        fuel_level: 5, // 5 litros restantes
        timestamp: '2023-10-27T11:00:00.000Z',
      },
      {
        vehicle_id: 1,
        license_plate: 'TEST-01',
        fuel_level: 15, // 15 litros hace una hora
        timestamp: '2023-10-27T10:00:00.000Z',
      },
    ];

    // Simular la respuesta de la base de datos
    db.all.mockImplementation((sql, params, callback) => {
      callback(null, mockRows);
    });

    // Llamar a la función a probar
    const currentReading = { vehicle_id: 1, fuel_level: 5 };
    checkFuelAutonomy(currentReading);

    // Verificaciones
    expect(db.all).toHaveBeenCalledTimes(1);
    expect(websocket.broadcastToAdmins).toHaveBeenCalledTimes(1);
    expect(websocket.broadcastToAdmins).toHaveBeenCalledWith({
      type: 'FUEL_ALERT',
      payload: expect.objectContaining({
        vehicle_id: 1,
        license_plate: 'TEST-01',
        message: expect.stringContaining('menos de 1 hora de autonomía'),
      }),
    });
  });

  it('NO debería emitir una alerta si la autonomía es mayor a 1 hora', () => {
    const mockRows = [
      {
        vehicle_id: 2,
        license_plate: 'TEST-02',
        fuel_level: 30, // 30 litros restantes
        timestamp: '2023-10-27T11:00:00.000Z',
      },
      {
        vehicle_id: 2,
        license_plate: 'TEST-02',
        fuel_level: 40, // 40 litros hace una hora
        timestamp: '2023-10-27T10:00:00.000Z',
      },
    ];

    // Simular la respuesta de la base de datos
    db.all.mockImplementation((sql, params, callback) => {
      callback(null, mockRows);
    });

    const currentReading = { vehicle_id: 2, fuel_level: 30 };
    checkFuelAutonomy(currentReading);

    // Verificaciones
    expect(db.all).toHaveBeenCalledTimes(1);
    expect(websocket.broadcastToAdmins).not.toHaveBeenCalled();
  });

  it('NO debería hacer nada si el vehículo ha recargado combustible', () => {
    const mockRows = [
      {
        vehicle_id: 3,
        license_plate: 'TEST-03',
        fuel_level: 50, // Nivel actual
        timestamp: '2023-10-27T11:00:00.000Z',
      },
      {
        vehicle_id: 3,
        license_plate: 'TEST-03',
        fuel_level: 20, // Nivel anterior
        timestamp: '2023-10-27T10:00:00.000Z',
      },
    ];

    db.all.mockImplementation((sql, params, callback) => {
      callback(null, mockRows);
    });

    const currentReading = { vehicle_id: 3, fuel_level: 50 };
    checkFuelAutonomy(currentReading);

    expect(websocket.broadcastToAdmins).not.toHaveBeenCalled();
  });

  it('NO debería hacer nada si no hay suficientes datos', () => {
    // Solo una lectura
    const mockRows = [
      {
        vehicle_id: 4,
        license_plate: 'TEST-04',
        fuel_level: 25,
        timestamp: '2023-10-27T11:00:00.000Z',
      },
    ];

    db.all.mockImplementation((sql, params, callback) => {
      callback(null, mockRows);
    });

    const currentReading = { vehicle_id: 4, fuel_level: 25 };
    checkFuelAutonomy(currentReading);

    expect(websocket.broadcastToAdmins).not.toHaveBeenCalled();
  });
}); 