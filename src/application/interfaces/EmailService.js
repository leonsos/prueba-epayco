/**
 * Interfaz para el servicio de email
 * Cualquier implementación del servicio de email debe cumplir con esta interfaz
 * @interface
 */
class EmailService {
  /**
   * Envía un email con el token de confirmación de pago
   * @param {string} email - Dirección de correo del destinatario
   * @param {string} token - Token a enviar
   * @param {string} sessionId - ID de la sesión
   * @returns {Promise<boolean>} - true si el correo fue enviado correctamente
   */
  async sendTokenEmail(email, token, sessionId) {
    throw new Error('Método sendTokenEmail no implementado');
  }
}

module.exports = EmailService; 