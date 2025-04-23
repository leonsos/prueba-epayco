require('dotenv').config();
const http = require('http');

// Capa de infraestructura
const { initDatabase, syncDatabase } = require('./src/infrastructure/persistence/database');
const SequelizeClientRepository = require('./src/infrastructure/persistence/SequelizeClientRepository');
const SequelizeSessionRepository = require('./src/infrastructure/persistence/SequelizeSessionRepository');
const NodemailerEmailService = require('./src/infrastructure/external_services/NodemailerEmailService');
const SoapWalletService = require('./src/infrastructure/external_services/SoapWalletService');
const SoapServer = require('./src/infrastructure/external_services/SoapServer');

// Capa de aplicación (casos de uso)
const RegisterClientUseCase = require('./src/application/use_cases/RegisterClientUseCase');
const RechargeWalletUseCase = require('./src/application/use_cases/RechargeWalletUseCase');
const GeneratePaymentUseCase = require('./src/application/use_cases/GeneratePaymentUseCase');
const ConfirmPaymentUseCase = require('./src/application/use_cases/ConfirmPaymentUseCase');
const GetBalanceUseCase = require('./src/application/use_cases/GetBalanceUseCase');

// Capa de API (controladores y rutas)
const WalletController = require('./src/api/controllers/WalletController');
const setupWalletRoutes = require('./src/api/routes/walletRoutes');
const setupApp = require('./src/api/app');

// Función para inicializar la aplicación
async function init() {
  try {
    // Configurar la base de datos
    await initDatabase();
    
    console.log('Verificando estructura de base de datos...');
    // Si es la primera vez o necesitamos resetear la estructura, usar true
    // En producción usar false para preservar datos
    const forceSync = process.env.FORCE_SYNC === 'true' || false;
    console.log(`Sincronizando base de datos con force=${forceSync}`);
    
    await syncDatabase(forceSync);
    
    // Instanciar repositorios
    const clientRepository = new SequelizeClientRepository();
    const sessionRepository = new SequelizeSessionRepository();
    
    // Instanciar servicios externos
    const emailService = new NodemailerEmailService();
    
    // Instanciar casos de uso
    const registerClientUseCase = new RegisterClientUseCase({ clientRepository });
    const rechargeWalletUseCase = new RechargeWalletUseCase({ clientRepository });
    const generatePaymentUseCase = new GeneratePaymentUseCase({ 
      clientRepository, 
      sessionRepository, 
      emailService 
    });
    const confirmPaymentUseCase = new ConfirmPaymentUseCase({ 
      clientRepository, 
      sessionRepository 
    });
    const getBalanceUseCase = new GetBalanceUseCase({ clientRepository });
    
    // Instanciar controladores
    const walletController = new WalletController({
      registerClientUseCase,
      rechargeWalletUseCase,
      generatePaymentUseCase,
      confirmPaymentUseCase,
      getBalanceUseCase
    });
    
    // Configurar rutas
    const walletRoutes = setupWalletRoutes({ walletController });
    
    // Configurar y crear aplicación Express
    const app = setupApp({ walletRoutes });
    
    // Crear servidor HTTP
    const httpServer = http.createServer(app);
    
    // Configurar servicio SOAP
    const soapWalletService = new SoapWalletService({
      registerClientUseCase,
      rechargeWalletUseCase,
      generatePaymentUseCase,
      confirmPaymentUseCase,
      getBalanceUseCase
    });
    
    // Crear y arrancar servidor SOAP
    const soapServer = new SoapServer({
      httpServer: httpServer,
      soapWalletService
    });
    
    // Arrancar servidor HTTP en puerto 3000
    const restPort = process.env.REST_PORT || 3000;
    httpServer.listen(restPort, () => {
      console.log(`Servidor REST iniciado en: http://localhost:${restPort}`);
      console.log(`Endpoints disponibles en: http://localhost:${restPort}/api/wallet`);
    });
    
    // Arrancar servidor SOAP en puerto 8000
    const soapPort = process.env.SOAP_PORT || 8000;
    const soapHttpServer = http.createServer((req, res) => {
      res.end('Servidor SOAP de Billetera Virtual');
    });
    
    soapHttpServer.listen(soapPort, async () => {
      try {
        await soapServer.start();
      } catch (error) {
        console.error('Error al iniciar el servidor SOAP:', error);
      }
    });
    
  } catch (error) {
    console.error('Error al inicializar la aplicación:', error);
    process.exit(1);
  }
}

// Iniciar la aplicación
init(); 