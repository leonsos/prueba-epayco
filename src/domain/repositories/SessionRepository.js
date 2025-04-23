/**
 * Interfaz que define las operaciones de repositorio para la entidad Sesión
 * Cualquier implementación de repositorio debe cumplir con esta interfaz
 * @interface
 */
class SessionRepository {
  /**
   * Busca una sesión por su ID
   * @param {number|string} id - ID de la sesión
   * @returns {Promise<Session|null>} - Sesión encontrada o null
   */
  async findById(id) {
    throw new Error('Método findById no implementado');
  }

  /**
   * Guarda una nueva sesión
   * @param {Session} session - Sesión a crear
   * @returns {Promise<Session>} - Sesión creada
   */
  async create(session) {
    throw new Error('Método create no implementado');
  }

  /**
   * Actualiza una sesión existente
   * @param {Session} session - Sesión con datos actualizados
   * @returns {Promise<Session>} - Sesión actualizada
   */
  async update(session) {
    throw new Error('Método update no implementado');
  }

  /**
   * Busca todas las sesiones activas (no utilizadas) de un cliente
   * @param {number|string} clientId - ID del cliente
   * @returns {Promise<Session[]>} - Lista de sesiones activas
   */
  async findActiveSessionsByClientId(clientId) {
    throw new Error('Método findActiveSessionsByClientId no implementado');
  }

  /**
   * Busca las sesiones por token
   * @param {string} token - Token de sesión
   * @returns {Promise<Session|null>} - Sesión encontrada o null
   */
  async findByToken(token) {
    throw new Error('Método findByToken no implementado');
  }
}

module.exports = SessionRepository; 