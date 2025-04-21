const { startSoapServer } = require('./src/soap/walletSoapServer');
const app = require('./src/app');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Puerto para el servidor REST
const PORT = process.env.PORT || 3000;

// Iniciar los servidores
async function startServers() {
  try {
    // Iniciar servidor SOAP
    await startSoapServer();
    
    // Iniciar servidor REST
    app.listen(PORT, () => {
      console.log(`Servidor REST iniciado en: http://localhost:${PORT}`);
      console.log(`Endpoints disponibles en: http://localhost:${PORT}/api/wallet`);
    });
  } catch (error) {
    console.error('Error al iniciar los servidores:', error);
    process.exit(1);
  }
}

// Iniciar aplicación
startServers(); 