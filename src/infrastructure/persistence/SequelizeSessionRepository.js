const SessionRepository = require('../../domain/repositories/SessionRepository');
const Session = require('../../domain/entities/Session');
const SessionModel = require('../persistence/models/Session');
const { Op } = require('sequelize');

/**
 * Implementación del repositorio de sesiones utilizando Sequelize
 * @implements {SessionRepository}
 */
class SequelizeSessionRepository extends SessionRepository {
  /**
   * @inheritdoc
   */
  async findById(id) {
    try {
      console.log('Buscando sesión con ID:', id);
      
      const sessionData = await SessionModel.findByPk(id);
      
      if (!sessionData) {
        console.log('Sesión no encontrada con ID:', id);
        return null;
      }
      
      console.log('Sesión encontrada:', {
        id: sessionData.id,
        token: sessionData.token,
        isUsed: sessionData.isUsed
      });
      
      return this._toDomainEntity(sessionData);
    } catch (error) {
      console.error('Error al buscar sesión por ID:', error);
      throw error;
    }
  }

  /**
   * @inheritdoc
   */
  async create(sessionEntity) {
    const sessionData = await SessionModel.create({
      clientId: sessionEntity.clientId,
      token: sessionEntity.token,
      valor: sessionEntity.valor,
      isUsed: sessionEntity.isUsed,
      expiresAt: sessionEntity.expiresAt
    });
    
    console.log('Sesión creada:', {
      id: sessionData.id,
      token: sessionData.token
    });
    
    return this._toDomainEntity(sessionData);
  }

  /**
   * @inheritdoc
   */
  async update(sessionEntity) {
    const sessionData = await SessionModel.findByPk(sessionEntity.id);
    
    if (!sessionData) {
      throw new Error(`Sesión con ID ${sessionEntity.id} no encontrada`);
    }
    
    await sessionData.update({
      clientId: sessionEntity.clientId,
      token: sessionEntity.token,
      valor: sessionEntity.valor,
      isUsed: sessionEntity.isUsed,
      expiresAt: sessionEntity.expiresAt
    });
    
    return this._toDomainEntity(sessionData);
  }

  /**
   * @inheritdoc
   */
  async findActiveSessionsByClientId(clientId) {
    const now = new Date();
    
    const sessionDataList = await SessionModel.findAll({
      where: {
        clientId,
        isUsed: false,
        expiresAt: {
          [Op.gt]: now
        }
      }
    });
    
    return sessionDataList.map(sessionData => this._toDomainEntity(sessionData));
  }

  /**
   * @inheritdoc
   */
  async findByToken(token) {
    try {
      console.log('Buscando sesión con token:', token);
      
      const sessionData = await SessionModel.findOne({
        where: { token }
      });
      
      console.log('Resultado de búsqueda por token:', sessionData ? 'Encontrado' : 'No encontrado');
      
      if (!sessionData) return null;
      
      return this._toDomainEntity(sessionData);
    } catch (error) {
      console.error('Error al buscar sesión por token:', error);
      throw error;
    }
  }

  /**
   * Convierte un modelo de datos a una entidad de dominio
   * @private
   * @param {Object} sessionData - Datos de la sesión desde la base de datos
   * @returns {Session} - Entidad de dominio
   */
  _toDomainEntity(sessionData) {
    return new Session(
      sessionData.id,
      sessionData.clientId,
      sessionData.token,
      parseFloat(sessionData.valor),
      sessionData.isUsed,
      new Date(sessionData.createdAt),
      new Date(sessionData.expiresAt)
    );
  }
}

module.exports = SequelizeSessionRepository; 