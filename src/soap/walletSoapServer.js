const soap = require('soap');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { testConnection } = require('../utils/database');
const { syncDatabase } = require('../models');
const walletService = require('./walletService');

// Ruta al archivo WSDL
const wsdlPath = path.join(__dirname, 'wallet.wsdl');

// Iniciar servidor SOAP
const startSoapServer = async () => {
  try {
    // Conectar a la base de datos
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('No se pudo conectar a la base de datos MySQL');
    }
    
    // Sincronizar los modelos con la base de datos
    await syncDatabase();
    console.log('Base de datos MySQL conectada y sincronizada');
    
    // Verificar que el archivo WSDL existe
    if (!fs.existsSync(wsdlPath)) {
      throw new Error(`Archivo WSDL no encontrado en: ${wsdlPath}`);
    }

    // Crear servidor HTTP
    const server = http.createServer((req, res) => {
      res.end('Servidor SOAP activo en: http://localhost:8000/wallet?wsdl');
    });
    
    // Crear servidor SOAP
    const wsdl = fs.readFileSync(wsdlPath, 'utf8');
    soap.listen(server, '/wallet', walletService, wsdl);
    
    // Iniciar servidor
    const SOAP_PORT = process.env.SOAP_PORT || 8000;
    server.listen(SOAP_PORT, () => {
      console.log(`Servidor SOAP iniciado en: http://localhost:${SOAP_PORT}/wallet?wsdl`);
    });

  } catch (error) {
    console.error('Error al iniciar el servidor SOAP:', error);
    process.exit(1);
  }
};

module.exports = { startSoapServer }; 