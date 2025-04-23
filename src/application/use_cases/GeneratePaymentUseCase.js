const Session = require('../../domain/entities/Session');

/**
 * Caso de uso: Generación de token para pago
 */
class GeneratePaymentUseCase {
  /**
   * @param {Object} dependencies - Dependencias del caso de uso
   * @param {import('../../domain/repositories/ClientRepository')} dependencies.clientRepository - Repositorio de clientes
   * @param {import('../../domain/repositories/SessionRepository')} dependencies.sessionRepository - Repositorio de sesiones
   * @param {Object} dependencies.emailService - Servicio de envío de emails
   */
  constructor({ clientRepository, sessionRepository, emailService }) {
    this.clientRepository = clientRepository;
    this.sessionRepository = sessionRepository;
    this.emailService = emailService;
  }

  /**
   * Ejecuta el caso de uso
   * @param {Object} paymentData - Datos para generar el pago
   * @param {string} paymentData.documento - Documento de identidad del cliente
   * @param {string} paymentData.celular - Número de celular del cliente
   * @param {number} paymentData.valor - Monto a pagar
   * @returns {Promise<Object>} - Resultado de la operación con formato estándar de respuesta
   */
  async execute(paymentData) {
    try {
      const { documento, celular, valor } = paymentData;
      
      // Validar que todos los campos estén presentes
      if (!documento || !celular || !valor) {
        return this.createResponse(false, '01', 'Todos los campos son requeridos');
      }
      
      // Validar que el valor sea un número positivo
      const amount = parseFloat(valor);
      if (isNaN(amount) || amount <= 0) {
        return this.createResponse(false, '03', 'El valor debe ser un número positivo');
      }
      
      // Buscar el cliente
      const client = await this.clientRepository.findByDocumentoAndCelular(documento, celular);
      
      if (!client) {
        return this.createResponse(false, '04', 'Cliente no encontrado');
      }
      
      // Verificar que tenga saldo suficiente
      if (!client.tieneSaldoSuficiente(amount)) {
        return this.createResponse(false, '05', 'Saldo insuficiente');
      }
      
      // Generar token y crear sesión
      const token = this.generateToken();
      const session = new Session(
        null, // ID será asignado por la base de datos
        client.id,
        token,
        amount
      );
      
      // Persistir la sesión
      const savedSession = await this.sessionRepository.create(session);
      
      // Enviar email con el token
      const emailSent = await this.emailService.sendTokenEmail(
        client.email, 
        token, 
        savedSession.id.toString()
      );
      
      if (!emailSent) {
        return this.createResponse(false, '06', 'Error al enviar el email con el token');
      }
      
      return this.createResponse(true, '00', 'Token generado y enviado por email', {
        sessionId: savedSession.id.toString()
      });
    } catch (error) {
      console.error('Error en GeneratePaymentUseCase:', error);
      return this.createResponse(false, '99', 'Error interno del servidor');
    }
  }

  /**
   * Genera un token aleatorio de 6 dígitos
   * @private
   * @returns {string} - Token generado
   */
  generateToken() {
    return Math.floor(100000 + Math.random() * 900000).toString();
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

module.exports = GeneratePaymentUseCase; 