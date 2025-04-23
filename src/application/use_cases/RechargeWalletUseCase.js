/**
 * Caso de uso: Recarga de billetera de un cliente
 */
class RechargeWalletUseCase {
  /**
   * @param {Object} dependencies - Dependencias del caso de uso
   * @param {import('../../domain/repositories/ClientRepository')} dependencies.clientRepository - Repositorio de clientes
   */
  constructor({ clientRepository }) {
    this.clientRepository = clientRepository;
  }

  /**
   * Ejecuta el caso de uso
   * @param {Object} rechargeData - Datos de la recarga
   * @param {string} rechargeData.documento - Documento de identidad del cliente
   * @param {string} rechargeData.celular - Número de celular del cliente
   * @param {number} rechargeData.valor - Monto a recargar
   * @returns {Promise<Object>} - Resultado de la operación con formato estándar de respuesta
   */
  async execute(rechargeData) {
    try {
      const { documento, celular, valor } = rechargeData;
      
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
      
      // Realizar la recarga utilizando la lógica de dominio
      client.recargarSaldo(amount);
      
      // Actualizar el cliente en el repositorio
      const updatedClient = await this.clientRepository.update(client);
      
      return this.createResponse(true, '00', 'Recarga exitosa', {
        nuevoSaldo: updatedClient.saldo
      });
    } catch (error) {
      console.error('Error en RechargeWalletUseCase:', error);
      
      // Manejar errores específicos del dominio
      if (error.message === 'El monto de recarga debe ser mayor a cero') {
        return this.createResponse(false, '03', error.message);
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

module.exports = RechargeWalletUseCase; 