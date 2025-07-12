const WebSocket = require('ws');

let wss;

function init(server) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Cliente WebSocket conectado.');

    ws.on('close', () => {
      console.log('Cliente WebSocket desconectado.');
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

module.exports = {
  init,
  broadcast,
};
