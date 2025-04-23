const express = require('express');
const cors = require('cors');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

/**
 * Configura la aplicación Express
 * @param {Object} dependencies - Dependencias
 * @param {Function} dependencies.walletRoutes - Función para configurar las rutas de la billetera
 * @returns {express.Application} - Aplicación Express configurada
 */
function setupApp({ walletRoutes }) {
  // Crear aplicación Express
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Configuración de rutas
  app.use('/api/wallet', walletRoutes);

  // Ruta principal
  app.get('/', (req, res) => {
    res.json({
      message: 'API de Billetera Virtual ePayco - Prueba Técnica'
    });
  });

  // Manejo de rutas no encontradas
  app.use(notFoundHandler);

  // Manejo de errores
  app.use(errorHandler);

  return app;
}

module.exports = setupApp; 