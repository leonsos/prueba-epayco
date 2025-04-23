const Client = require('../../domain/entities/Client');

/**
 * Caso de uso: Registro de un cliente
 */
class RegisterClientUseCase {
  /**
   * @param {Object} dependencies - Dependencias del caso de uso
   * @param {import('../../domain/repositories/ClientRepository')} dependencies.clientRepository - Repositorio de clientes
   */
  constructor({ clientRepository }) {
    this.clientRepository = clientRepository;
  }

  /**
   * Ejecuta el caso de uso
   * @param {Object} clientData - Datos del cliente a registrar
   * @param {string} clientData.documento - Documento de identidad
   * @param {string} clientData.nombres - Nombre completo
   * @param {string} clientData.email - Correo electrónico
   * @param {string} clientData.celular - Número de celular
   * @returns {Promise<Object>} - Resultado de la operación con formato estándar de respuesta
   */
  async execute(clientData) {
    try {
      const { documento, nombres, email, celular } = clientData;
      
      // Validar que todos los campos estén presentes
      if (!documento || !nombres || !email || !celular) {
        return this.createResponse(false, '01', 'Todos los campos son requeridos');
      }
      
      // Verificar si el cliente ya existe
      const existingClientByDoc = await this.clientRepository.findByDocumento(documento);
      const existingClientByEmail = await this.clientRepository.findByEmail(email);
      
      if (existingClientByDoc || existingClientByEmail) {
        return this.createResponse(false, '02', 'El cliente ya está registrado con ese documento o email');
      }
      
      // Crear la entidad cliente
      const newClient = new Client(
        null, // El ID lo asignará la base de datos
        documento,
        nombres,
        email,
        celular,
        0 // Saldo inicial
      );
      
      // Persistir el cliente
      const savedClient = await this.clientRepository.create(newClient);
      
      return this.createResponse(true, '00', 'Cliente registrado exitosamente', {
        cliente: {
          documento: savedClient.documento,
          nombres: savedClient.nombres,
          email: savedClient.email,
          celular: savedClient.celular
        }
      });
    } catch (error) {
      console.error('Error en RegisterClientUseCase:', error);
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

module.exports = RegisterClientUseCase; 