const authController = require('../authController');
const db = require('../../config/database');
const crypto = require('crypto');

// Mockear la base de datos
jest.mock('../../config/database', () => ({
  get: jest.fn(),
  run: jest.fn(),
}));

// Mockear variables de entorno
process.env.JWT_SECRET = 'test-secret';

describe('Auth Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debería retornar un token con credenciales válidas', () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        // Contraseña hasheada 'password'
        password: crypto.createHash('sha256').update('password').digest('hex'),
        admin: 1,
      };

      db.get.mockImplementation((sql, params, callback) => {
        callback(null, mockUser);
      });

      const req = { body: { username: 'testuser', password: 'password' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      authController.login(req, res);

      expect(db.get).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Login exitoso',
          token: expect.any(String),
        })
      );
    });

    it('debería retornar error 401 con credenciales inválidas', () => {
      db.get.mockImplementation((sql, params, callback) => {
        callback(null, null); // Usuario no encontrado
      });

      const req = { body: { username: 'wronguser', password: 'wrongpassword' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Credenciales inválidas' });
    });
  });

  describe('register', () => {
    it('debería registrar un nuevo usuario exitosamente', () => {
      db.run.mockImplementation((sql, params, callback) => {
        // 'this.lastID' se simula pasándolo como argumento a la callback
        callback.call({ lastID: 123 }, null);
      });

      const req = { body: { username: 'newuser', password: 'newpassword' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      authController.register(req, res);

      expect(db.run).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuario registrado exitosamente',
        userId: 123,
      });
    });

    it('debería retornar error 409 si el usuario ya existe', () => {
      const error = new Error("UNIQUE constraint failed: users.username");
      db.run.mockImplementation((sql, params, callback) => {
        callback(error);
      });

      const req = { body: { username: 'existinguser', password: 'password' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: "El usuario 'existinguser' ya existe." });
    });
  });
}); 