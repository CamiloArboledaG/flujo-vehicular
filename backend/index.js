require('dotenv').config();
const app = require('./src/app');
const db = require('./src/config/database');

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Conexión a la base de datos cerrada.');
    process.exit(0);
  });
});
