/**
 * Clase que representa la entidad Sesión de pago en el dominio
 * Esta es una representación pura del modelo de negocio, sin detalles de infraestructura
 */
class Session {
  constructor(id, clientId, token, valor, isUsed = false, createdAt = new Date(), expiresAt = null) {
    this.id = id;
    this.clientId = clientId;
    this.token = token;
    this.valor = valor;
    this.isUsed = isUsed;
    this.createdAt = createdAt;
    
    // Si no se proporciona una fecha de expiración, establecerla a 30 minutos después de la creación
    this.expiresAt = expiresAt || new Date(this.createdAt.getTime() + 30 * 60000);
  }

  /**
   * Marca la sesión como utilizada
   */
  markAsUsed() {
    this.isUsed = true;
    return this;
  }

  /**
   * Verifica si la sesión ha expirado
   * @returns {boolean} - true si la sesión ha expirado
   */
  hasExpired() {
    return new Date() > this.expiresAt;
  }

  /**
   * Verifica si la sesión está disponible para ser usada
   * @returns {boolean} - true si la sesión está disponible
   */
  isAvailable() {
    return !this.isUsed && !this.hasExpired();
  }

  /**
   * Verifica si el token proporcionado coincide con el de esta sesión
   * @param {string} tokenToVerify - Token a verificar
   * @returns {boolean} - true si el token coincide
   */
  validateToken(tokenToVerify) {
    console.log('Validando token:');
    console.log('Token almacenado:', this.token);
    console.log('Token recibido:', tokenToVerify);
    const isValid = this.token === tokenToVerify;
    console.log('¿Son iguales?', isValid);
    return isValid;
  }
}

module.exports = Session; 