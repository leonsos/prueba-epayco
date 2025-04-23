const ClientRepository = require('../../domain/repositories/ClientRepository');
const Client = require('../../domain/entities/Client');
const ClientModel = require('../persistence/models/Client');
const { Op } = require('sequelize');

/**
 * Implementación del repositorio de clientes utilizando Sequelize
 * @implements {ClientRepository}
 */
class SequelizeClientRepository extends ClientRepository {
  /**
   * @inheritdoc
   */
  async findByDocumentoAndCelular(documento, celular) {
    const clientData = await ClientModel.findOne({
      where: {
        documento,
        celular
      }
    });

    if (!clientData) return null;

    return this._toDomainEntity(clientData);
  }

  /**
   * @inheritdoc
   */
  async findById(id) {
    const clientData = await ClientModel.findByPk(id);
    
    if (!clientData) return null;
    
    return this._toDomainEntity(clientData);
  }

  /**
   * @inheritdoc
   */
  async findByDocumento(documento) {
    try {
      console.log('Buscando cliente con documento:', documento);
      
      // Intentar consulta directa con atributos específicos
      const clientData = await ClientModel.findOne({
        where: { documento },
        attributes: ['id', 'documento', 'nombres', 'email', 'celular', 'saldo']
      });
      
      console.log('Resultado de la consulta:', clientData ? 'Cliente encontrado' : 'Cliente no encontrado');
      
      if (!clientData) return null;
      
      return this._toDomainEntity(clientData);
    } catch (error) {
      console.error('Error en findByDocumento:', error);
      throw error;
    }
  }

  /**
   * @inheritdoc
   */
  async findByEmail(email) {
    const clientData = await ClientModel.findOne({
      where: { email }
    });
    
    if (!clientData) return null;
    
    return this._toDomainEntity(clientData);
  }

  /**
   * @inheritdoc
   */
  async create(clientEntity) {
    const clientData = await ClientModel.create({
      documento: clientEntity.documento,
      nombres: clientEntity.nombres,
      email: clientEntity.email,
      celular: clientEntity.celular,
      saldo: clientEntity.saldo || 0
    });
    
    return this._toDomainEntity(clientData);
  }

  /**
   * @inheritdoc
   */
  async update(clientEntity) {
    const clientData = await ClientModel.findByPk(clientEntity.id);
    
    if (!clientData) {
      throw new Error(`Cliente con ID ${clientEntity.id} no encontrado`);
    }
    
    await clientData.update({
      documento: clientEntity.documento,
      nombres: clientEntity.nombres,
      email: clientEntity.email,
      celular: clientEntity.celular,
      saldo: clientEntity.saldo
    });
    
    return this._toDomainEntity(clientData);
  }

  /**
   * Convierte un modelo de datos a una entidad de dominio
   * @private
   * @param {Object} clientData - Datos del cliente desde la base de datos
   * @returns {Client} - Entidad de dominio
   */
  _toDomainEntity(clientData) {
    return new Client(
      clientData.id,
      clientData.documento,
      clientData.nombres,
      clientData.email,
      clientData.celular,
      parseFloat(clientData.saldo)
    );
  }
}

module.exports = SequelizeClientRepository; 