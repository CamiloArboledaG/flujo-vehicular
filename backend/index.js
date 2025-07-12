require('dotenv').config();
const app = require('./src/app');
const db = require('./src/config/database');
const webSocketServer = require('./src/websocket');

const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});

// Inicializar el servidor de WebSockets
webSocketServer.init(server);

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Conexión a la base de datos cerrada.');
    process.exit(0);
  });
});
