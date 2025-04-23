const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Configuración de la base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME || 'wallet',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307,
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true,
      // Aseguramos que los nombres de las columnas de timestamp sean camelCase, no snake_case
      underscored: false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a MySQL establecida correctamente.');
    return true;
  } catch (error) {
    console.error('Error al conectar a MySQL:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection
}; 