/**
 * Controlador REST para la billetera
 */
class WalletController {
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
   * Registrar un cliente
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async registerClient(req, res) {
    try {
      const result = await this.registerClientUseCase.execute(req.body);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error en el controlador de registro:', error);
      res.status(500).json({
        success: false,
        cod_error: '99',
        message_error: 'Error interno del servidor',
        data: null
      });
    }
  }

  /**
   * Recargar billetera
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async rechargeWallet(req, res) {
    try {
      const result = await this.rechargeWalletUseCase.execute(req.body);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error en el controlador de recarga:', error);
      res.status(500).json({
        success: false,
        cod_error: '99',
        message_error: 'Error interno del servidor',
        data: null
      });
    }
  }

  /**
   * Generar pago (crear token)
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async generatePayment(req, res) {
    try {
      const result = await this.generatePaymentUseCase.execute(req.body);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error en el controlador de generación de pago:', error);
      res.status(500).json({
        success: false,
        cod_error: '99',
        message_error: 'Error interno del servidor',
        data: null
      });
    }
  }

  /**
   * Confirmar pago con token
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async confirmPayment(req, res) {
    try {
      const result = await this.confirmPaymentUseCase.execute(req.body);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error en el controlador de confirmación de pago:', error);
      res.status(500).json({
        success: false,
        cod_error: '99',
        message_error: 'Error interno del servidor',
        data: null
      });
    }
  }

  /**
   * Consultar saldo
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async getBalance(req, res) {
    try {
      const result = await this.getBalanceUseCase.execute(req.body);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error en el controlador de consulta de saldo:', error);
      res.status(500).json({
        success: false,
        cod_error: '99',
        message_error: 'Error interno del servidor',
        data: null
      });
    }
  }
}

module.exports = WalletController; 