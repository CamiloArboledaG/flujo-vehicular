const WebSocket = require('ws');
const url = require('url');
const crypto = require('crypto');

let wss;

function verifyJwt(token) {
  if (!token) return null;

  try {
    const [encodedHeader, encodedPayload, signature] = token.split('.');
    if (!encodedHeader || !encodedPayload || !signature) {
      return null;
    }

    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.JWT_SECRET)
      .update(signatureInput)
      .digest('base64url');

    if (signature !== expectedSignature) {
      console.warn('Firma de JWT inválida');
      return null;
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8'));

    if (payload.exp * 1000 < Date.now()) {
      console.warn('Token JWT expirado');
      return null;
    }

    return payload;
  } catch (error) {
    console.error('Error al verificar el token JWT:', error);
    return null;
  }
}

function init(server) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    // Extraemos el token de la URL de conexión
    const { query } = url.parse(req.url, true);
    const token = query.token;
    const user = verifyJwt(token);

    if (user) {
      console.log(`Cliente WebSocket conectado y autenticado como: ${user.username}. Admin: ${!!user.admin}`);
      ws.isAuth = true;
      ws.isAdmin = !!user.admin;
    } else {
      console.log('Cliente WebSocket conectado pero no autenticado.');
      ws.isAuth = false;
      ws.isAdmin = false;
    }

    ws.on('close', () => {
      if (ws.isAuth) {
        console.log('Cliente WebSocket autenticado desconectado.');
      } else {
        console.log('Cliente WebSocket no autenticado desconectado.');
      }
    });

    ws.on('error', (error) => {
      console.error('Error en WebSocket:', error);
    });
  });
}

function broadcast(data) {
  if (!wss) {
    console.error('El servidor WebSocket no está inicializado.');
    return;
  }

  const message = JSON.stringify(data);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function broadcastToAdmins(data) {
  if (!wss) {
    console.error('El servidor WebSocket no está inicializado.');
    return;
  }

  const message = JSON.stringify(data);

  wss.clients.forEach((client) => {
    // Solo enviamos a clientes autenticados y que son administradores
    if (client.readyState === WebSocket.OPEN && client.isAdmin) {
      client.send(message);
    }
  });
}

module.exports = {
  init,
  broadcast,
  broadcastToAdmins,
};
