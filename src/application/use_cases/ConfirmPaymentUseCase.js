/**
 * Caso de uso: Confirmación de pago con token
 */
class ConfirmPaymentUseCase {
  /**
   * @param {Object} dependencies - Dependencias del caso de uso
   * @param {import('../../domain/repositories/ClientRepository')} dependencies.clientRepository - Repositorio de clientes
   * @param {import('../../domain/repositories/SessionRepository')} dependencies.sessionRepository - Repositorio de sesiones
   */
  constructor({ clientRepository, sessionRepository }) {
    this.clientRepository = clientRepository;
    this.sessionRepository = sessionRepository;
  }

  /**
   * Ejecuta el caso de uso
   * @param {Object} confirmationData - Datos para confirmar el pago
   * @param {string} confirmationData.sessionId - ID de la sesión
   * @param {string} confirmationData.token - Token de confirmación
   * @returns {Promise<Object>} - Resultado de la operación con formato estándar de respuesta
   */
  async execute(confirmationData) {
    try {
      const { sessionId, token } = confirmationData;
      
      // Validar que todos los campos estén presentes
      if (!sessionId || !token) {
        return this.createResponse(false, '01', 'Todos los campos son requeridos');
      }
      
      // Buscar la sesión
      const session = await this.sessionRepository.findById(sessionId);
      if (!session) {
        return this.createResponse(false, '07', 'Sesión no encontrada');
      }
      
      // Verificar si la sesión ya fue utilizada
      if (session.isUsed) {
        return this.createResponse(false, '08', 'Esta sesión ya fue utilizada');
      }
      
      // Verificar si la sesión ha expirado
      if (session.hasExpired()) {
        return this.createResponse(false, '09', 'La sesión ha expirado');
      }
      
      // Verificar que el token coincida
      if (!session.validateToken(token)) {
        return this.createResponse(false, '10', 'Token inválido');
      }
      
      // Buscar el cliente
      const client = await this.clientRepository.findById(session.clientId);
      if (!client) {
        return this.createResponse(false, '04', 'Cliente no encontrado');
      }
      
      // Verificar nuevamente que tenga saldo suficiente
      if (!client.tieneSaldoSuficiente(session.valor)) {
        return this.createResponse(false, '05', 'Saldo insuficiente');
      }
      
      // Realizar el pago utilizando la lógica de dominio
      client.realizarPago(session.valor);
      
      // Marcar la sesión como utilizada
      session.markAsUsed();
      
      // Actualizar el cliente y la sesión en la base de datos
      const updatedClient = await this.clientRepository.update(client);
      await this.sessionRepository.update(session);
      
      return this.createResponse(true, '00', 'Pago confirmado exitosamente', {
        nuevoSaldo: updatedClient.saldo,
        valorPagado: session.valor
      });
    } catch (error) {
      console.error('Error en ConfirmPaymentUseCase:', error);
      
      // Manejar errores específicos del dominio
      if (error.message === 'Saldo insuficiente') {
        return this.createResponse(false, '05', error.message);
      }
      
      return this.createResponse(false, '99', 'Error interno del servidor');
    }
  }

  /**
   * Función auxiliar para generar respuestas estandarizadas
   * @private
   */
  createResponse(success, codError, messageError, data = null) {
    return {
      success,
      cod_error: codError,
      message_error: messageError,
      data
    };
  }
}

module.exports = ConfirmPaymentUseCase; 