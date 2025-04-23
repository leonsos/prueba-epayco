/**
 * Middleware para manejar errores HTTP
 * @param {Error} err - Error capturado
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 */
function errorHandler(err, req, res, next) {
  console.error('Error no controlado:', err);
  
  // Errores específicos de la aplicación pueden ser manejados aquí
  // por ejemplo, errores de validación, autenticación, etc.
  
  // Respuesta estándar para errores del servidor
  res.status(500).json({
    success: false,
    cod_error: '500',
    message_error: 'Error interno del servidor',
    data: null
  });
}

/**
 * Middleware para manejar rutas no encontradas
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    cod_error: '404',
    message_error: 'Ruta no encontrada',
    data: null
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
}; 