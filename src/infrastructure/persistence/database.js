const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME || 'wallet',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307,
    dialect: 'mysql',
    logging: console.log,
    define: {
      timestamps: true,
      underscored: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Función para inicializar la conexión
const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Base de datos MySQL conectada exitosamente');
    return true;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    return false;
  }
};

// Función para sincronizar los modelos con la base de datos
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('Base de datos sincronizada correctamente');
    return true;
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  initDatabase,
  syncDatabase
}; 