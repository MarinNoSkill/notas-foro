const app = require('./app');  // Importamos la aplicación de app.js
const { connectToDb } = require('./config/dbconfig'); // Importar la función de conexión a la base de datos

// Conectar a la base de datos antes de iniciar el servidor
(async () => {
  try {
    await connectToDb();  // Establecer la conexión a la base de datos
    app.listen(app.get('port'), () => {
      console.log("Servidor escuchando en el puerto", app.get("port"));
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor debido a un error de conexión a la base de datos:", error);
  }
})();
