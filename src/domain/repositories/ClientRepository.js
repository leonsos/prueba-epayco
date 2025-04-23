/**
 * Interfaz que define las operaciones de repositorio para la entidad Cliente
 * Cualquier implementación de repositorio debe cumplir con esta interfaz
 * @interface
 */
class ClientRepository {
  /**
   * Busca un cliente por su documento y celular
   * @param {string} documento - Documento de identidad del cliente
   * @param {string} celular - Número de celular del cliente
   * @returns {Promise<Client|null>} - Cliente encontrado o null
   */
  async findByDocumentoAndCelular(documento, celular) {
    throw new Error('Método findByDocumentoAndCelular no implementado');
  }

  /**
   * Busca un cliente por su ID
   * @param {number|string} id - ID del cliente
   * @returns {Promise<Client|null>} - Cliente encontrado o null
   */
  async findById(id) {
    throw new Error('Método findById no implementado');
  }

  /**
   * Busca un cliente por su documento
   * @param {string} documento - Documento de identidad del cliente
   * @returns {Promise<Client|null>} - Cliente encontrado o null
   */
  async findByDocumento(documento) {
    throw new Error('Método findByDocumento no implementado');
  }

  /**
   * Busca un cliente por su email
   * @param {string} email - Email del cliente
   * @returns {Promise<Client|null>} - Cliente encontrado o null
   */
  async findByEmail(email) {
    throw new Error('Método findByEmail no implementado');
  }

  /**
   * Guarda un nuevo cliente
   * @param {Client} cliente - Cliente a crear
   * @returns {Promise<Client>} - Cliente creado
   */
  async create(cliente) {
    throw new Error('Método create no implementado');
  }

  /**
   * Actualiza un cliente existente
   * @param {Client} cliente - Cliente con datos actualizados
   * @returns {Promise<Client>} - Cliente actualizado
   */
  async update(cliente) {
    throw new Error('Método update no implementado');
  }
}

module.exports = ClientRepository; 