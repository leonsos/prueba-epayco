const soap = require('soap');
const util = require('util');

// URL del servicio SOAP
const url = 'http://localhost:8000/wallet?wsdl';

// Clase para el cliente SOAP
class SoapClient {
  constructor() {
    this.client = null;
  }

  // Método para inicializar el cliente
  async init() {
    try {
      if (!this.client) {
        this.client = await util.promisify(soap.createClient)(url);
        console.log('Cliente SOAP inicializado');
      }
      return this.client;
    } catch (error) {
      console.error('Error al inicializar cliente SOAP:', error);
      throw error;
    }
  }

  // Método para registrar un cliente
  async registroCliente(documento, nombres, email, celular) {
    await this.init();
    const registrarPromise = util.promisify(this.client.RegistroCliente);
    return registrarPromise({
      documento,
      nombres,
      email,
      celular
    });
  }

  // Método para recargar la billetera
  async recargaBilletera(documento, celular, valor) {
    await this.init();
    const recargarPromise = util.promisify(this.client.RecargaBilletera);
    return recargarPromise({
      documento,
      celular,
      valor
    });
  }

  // Método para iniciar un pago
  async pagar(documento, celular, valor) {
    await this.init();
    const pagarPromise = util.promisify(this.client.Pagar);
    return pagarPromise({
      documento,
      celular,
      valor
    });
  }

  // Método para confirmar un pago
  async confirmarPago(sessionId, token) {
    await this.init();
    const confirmarPromise = util.promisify(this.client.ConfirmarPago);
    return confirmarPromise({
      sessionId,
      token
    });
  }

  // Método para consultar el saldo
  async consultarSaldo(documento, celular) {
    await this.init();
    const consultarPromise = util.promisify(this.client.ConsultarSaldo);
    return consultarPromise({
      documento,
      celular
    });
  }
}

// Exportar una instancia del cliente
module.exports = new SoapClient(); 