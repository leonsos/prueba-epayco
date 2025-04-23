/**
 * Caso de uso: Consulta de saldo de un cliente
 */
class GetBalanceUseCase {
  /**
   * @param {Object} dependencies - Dependencias del caso de uso
   * @param {import('../../domain/repositories/ClientRepository')} dependencies.clientRepository - Repositorio de clientes
   */
  constructor({ clientRepository }) {
    this.clientRepository = clientRepository;
  }

  /**
   * Ejecuta el caso de uso
   * @param {Object} queryData - Datos para la consulta
   * @param {string} queryData.documento - Documento de identidad del cliente
   * @param {string} queryData.celular - Número de celular del cliente
   * @returns {Promise<Object>} - Resultado de la operación con formato estándar de respuesta
   */
  async execute(queryData) {
    try {
      const { documento, celular } = queryData;
      
      // Validar que todos los campos estén presentes
      if (!documento || !celular) {
        return this.createResponse(false, '01', 'Todos los campos son requeridos');
      }
      
      // Buscar el cliente
      const client = await this.clientRepository.findByDocumentoAndCelular(documento, celular);
      
      if (!client) {
        return this.createResponse(false, '04', 'Cliente no encontrado');
      }
      
      return this.createResponse(true, '00', 'Consulta exitosa', {
        cliente: {
          documento: client.documento,
          nombres: client.nombres,
          email: client.email,
          celular: client.celular
        },
        saldo: client.saldo
      });
    } catch (error) {
      console.error('Error en GetBalanceUseCase:', error);
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

module.exports = GetBalanceUseCase; 