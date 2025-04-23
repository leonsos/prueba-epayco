const nodemailer = require('nodemailer');
const EmailService = require('../../application/interfaces/EmailService');

/**
 * Implementación del servicio de email utilizando Nodemailer
 * @implements {EmailService}
 */
class NodemailerEmailService extends EmailService {
  constructor() {
    super();
    
    // Configuración del transporter para envío de emails
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'tu_correo@gmail.com',
        pass: process.env.EMAIL_PASS || 'tu_contraseña'
      }
    });
  }
  
  /**
   * @inheritdoc
   */
  async sendTokenEmail(email, token, sessionId) {
    try {
      // Para desarrollo o tests podemos simular el envío
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        console.log(`========================================`);
        console.log(`SIMULACIÓN DE ENVÍO DE EMAIL:`);
        console.log(`Destinatario: ${email}`);
        console.log(`Token de confirmación: ${token}`);
        console.log(`ID de Sesión: ${sessionId}`);
        console.log(`========================================`);
        
        return true;
      }
      
      // En producción, enviar el email real
      await this.transporter.sendMail({
        from: '"Billetera Virtual" <noreply@billetera.com>',
        to: email,
        subject: 'Código de confirmación para tu compra',
        html: `
          <h1>Código de confirmación</h1>
          <p>Tu código de confirmación para completar la compra es: <strong>${token}</strong></p>
          <p>ID de Sesión: <strong>${sessionId}</strong></p>
          <p>Este código expirará en 30 minutos.</p>
        `
      });
      
      return true;
    } catch (error) {
      console.error('Error al enviar email:', error);
      return false;
    }
  }
}

module.exports = NodemailerEmailService; 