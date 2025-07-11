const db = require('../config/database');
const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function createJwt(payload) {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');

  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto.createHmac('sha256', process.env.JWT_SECRET).update(signatureInput).digest('base64url');

  return `${signatureInput}.${signature}`;
}

exports.register = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  }

  const hashedPassword = hashPassword(password);

  const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
  db.run(sql, [username, hashedPassword], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: `El usuario '${username}' ya existe.` });
      }
      return res.status(500).json({ error: 'Error al registrar el usuario.' });
    }
    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: this.lastID });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  }

  const sql = `SELECT * FROM users WHERE username = ?`;
  db.get(sql, [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Error del servidor' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const payload = {
      id: user.id,
      username: user.username,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expira en 1 hora
    };

    const token = createJwt(payload);

    res.json({ message: 'Login exitoso', token });
  });
};
