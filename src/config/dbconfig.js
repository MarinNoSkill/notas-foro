const sql = require('mssql');

const config = {
  user: 'MarinNoSkill',
  password: 'Nanotv1234',
  server: 'serverseraquepierdo.database.windows.net',
  database: 'BD_NOTASFORO',
  options: {
    encrypt: true, 
    enableArithAbort: true
  }
};

async function connectToDb() {
  try {
    let pool = await sql.connect(config);
    console.log("Conectado a la base de datos");
    return pool;
  } catch (error) {
    console.error("Error al conectar a la base de datos", error);
  }
}

module.exports = { connectToDb };
