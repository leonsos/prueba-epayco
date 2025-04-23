/**
 * Servicio SOAP para la billetera utilizando casos de uso
 */
class SoapWalletService {
  /**
   * @param {Object} dependencies - Dependencias
   * @param {import('../../application/use_cases/RegisterClientUseCase')} dependencies.registerClientUseCase - Caso de uso para registrar clientes
   * @param {import('../../application/use_cases/RechargeWalletUseCase')} dependencies.rechargeWalletUseCase - Caso de uso para recargar billetera
   * @param {import('../../application/use_cases/GeneratePaymentUseCase')} dependencies.generatePaymentUseCase - Caso de uso para generar pago
   * @param {import('../../application/use_cases/ConfirmPaymentUseCase')} dependencies.confirmPaymentUseCase - Caso de uso para confirmar pago
   * @param {import('../../application/use_cases/GetBalanceUseCase')} dependencies.getBalanceUseCase - Caso de uso para consultar saldo
   */
  constructor({
    registerClientUseCase,
    rechargeWalletUseCase,
    generatePaymentUseCase,
    confirmPaymentUseCase,
    getBalanceUseCase
  }) {
    this.registerClientUseCase = registerClientUseCase;
    this.rechargeWalletUseCase = rechargeWalletUseCase;
    this.generatePaymentUseCase = generatePaymentUseCase;
    this.confirmPaymentUseCase = confirmPaymentUseCase;
    this.getBalanceUseCase = getBalanceUseCase;
  }

  /**
   * Obtiene la definición del servicio SOAP
   * @returns {Object} - Definición del servicio SOAP
   */
  getServiceDefinition() {
    return {
      WalletService: {
        WalletServiceSoap: {
          // Registro de cliente
          RegistroCliente: async (args) => {
            return await this.registerClientUseCase.execute(args);
          },
          
          // Recarga de billetera
          RecargaBilletera: async (args) => {
            return await this.rechargeWalletUseCase.execute(args);
          },
          
          // Pagar (generar token)
          Pagar: async (args) => {
            return await this.generatePaymentUseCase.execute(args);
          },
          
          // Confirmar Pago
          ConfirmarPago: async (args) => {
            return await this.confirmPaymentUseCase.execute(args);
          },
          
          // Consultar Saldo
          ConsultarSaldo: async (args) => {
            return await this.getBalanceUseCase.execute(args);
          }
        }
      }
    };
  }
}

module.exports = SoapWalletService; 