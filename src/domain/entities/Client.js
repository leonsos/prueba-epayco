/**
 * Clase que representa la entidad Cliente en el dominio
 * Esta es una representación pura del modelo de negocio, sin detalles de infraestructura
 */
class Client {
  constructor(id, documento, nombres, email, celular, saldo = 0) {
    this.id = id;
    this.documento = documento;
    this.nombres = nombres;
    this.email = email;
    this.celular = celular;
    this.saldo = saldo;
  }

  /**
   * Añade saldo a la billetera del cliente
   * @param {number} monto - Cantidad a añadir al saldo
   * @returns {number} - Nuevo saldo
   */
  recargarSaldo(monto) {
    if (monto <= 0) {
      throw new Error('El monto de recarga debe ser mayor a cero');
    }
    this.saldo += monto;
    return this.saldo;
  }

  /**
   * Reduce el saldo por un pago
   * @param {number} monto - Cantidad a reducir del saldo
   * @returns {number} - Nuevo saldo
   */
  realizarPago(monto) {
    if (monto <= 0) {
      throw new Error('El monto del pago debe ser mayor a cero');
    }
    
    if (this.saldo < monto) {
      throw new Error('Saldo insuficiente');
    }
    
    this.saldo -= monto;
    return this.saldo;
  }

  /**
   * Verifica si el cliente tiene saldo suficiente
   * @param {number} monto - Cantidad a verificar
   * @returns {boolean} - true si tiene saldo suficiente
   */
  tieneSaldoSuficiente(monto) {
    return this.saldo >= monto;
  }
}

module.exports = Client; 