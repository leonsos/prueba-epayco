const soap = require('soap');
const fs = require('fs');
const path = require('path');

/**
 * Servidor SOAP
 */
class SoapServer {
  /**
   * @param {Object} dependencies - Dependencias
   * @param {Object} dependencies.httpServer - Servidor HTTP
   * @param {import('./SoapWalletService')} dependencies.soapWalletService - Servicio SOAP de billetera
   */
  constructor({ httpServer, soapWalletService }) {
    this.httpServer = httpServer;
    this.soapWalletService = soapWalletService;
    this.wsdlPath = path.join(__dirname, 'wallet.wsdl');
  }

  /**
   * Inicia el servidor SOAP
   * @returns {Promise<string>} - URL del servicio SOAP
   */
  async start() {
    if (!fs.existsSync(this.wsdlPath)) {
      throw new Error(`El archivo WSDL no existe en la ruta: ${this.wsdlPath}`);
    }

    const wsdl = fs.readFileSync(this.wsdlPath, 'utf8');
    const serviceDefinition = this.soapWalletService.getServiceDefinition();
    
    const soapUrl = '/wallet';
    
    return new Promise((resolve) => {
      soap.listen(this.httpServer, soapUrl, serviceDefinition, wsdl);
      const fullUrl = `http://localhost:${this.httpServer.address().port}${soapUrl}?wsdl`;
      console.log(`Servidor SOAP iniciado en: ${fullUrl}`);
      resolve(fullUrl);
    });
  }
}

module.exports = SoapServer; 