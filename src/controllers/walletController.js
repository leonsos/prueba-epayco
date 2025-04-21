const soapClient = require('../services/soapClient');

// Controlador para las operaciones de la billetera virtual
class WalletController {
  // Registrar un nuevo cliente
  async registroCliente(req, res) {
    try {
      const { documento, nombres, email, celular } = req.body;
      
      // Validaciones básicas
      if (!documento || !nombres || !email || !celular) {
        return res.status(400).json({
          success: false,
          cod_error: '01',
          message_error: 'Todos los campos son requeridos',
          data: null
        });
      }
      
      // Llamar al servicio SOAP
      const result = await soapClient.registroCliente(documento, nombres, email, celular);
      
      // Responder con el resultado del servicio SOAP
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error en el controlador registroCliente:', error);
      return res.status(500).json({
        success: false,
        cod_error: '99',
        message_error: 'Error interno del servidor',
        data: null
      });
    }
  }

  // Recargar la billetera
  async recargaBilletera(req, res) {
    try {
      const { documento, celular, valor } = req.body;
      
      // Validaciones básicas
      if (!documento || !celular || !valor) {
        return res.status(400).json({
          success: false,
          cod_error: '01',
          message_error: 'Todos los campos son requeridos',
          data: null
        });
      }
      
      // Validar que el valor sea un número positivo
      const amount = parseFloat(valor);
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({
          success: false,
          cod_error: '03',
          message_error: 'El valor debe ser un número positivo',
          data: null
        });
      }
      
      // Llamar al servicio SOAP
      const result = await soapClient.recargaBilletera(documento, celular, valor);
      
      // Responder con el resultado del servicio SOAP
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error en el controlador recargaBilletera:', error);
      return res.status(500).json({
        success: false,
        cod_error: '99',
        message_error: 'Error interno del servidor',
        data: null
      });
    }
  }

  // Iniciar un pago
  async pagar(req, res) {
    try {
      const { documento, celular, valor } = req.body;
      
      // Validaciones básicas
      if (!documento || !celular || !valor) {
        return res.status(400).json({
          success: false,
          cod_error: '01',
          message_error: 'Todos los campos son requeridos',
          data: null
        });
      }
      
      // Validar que el valor sea un número positivo
      const amount = parseFloat(valor);
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({
          success: false,
          cod_error: '03',
          message_error: 'El valor debe ser un número positivo',
          data: null
        });
      }
      
      // Llamar al servicio SOAP
      const result = await soapClient.pagar(documento, celular, valor);
      
      // Responder con el resultado del servicio SOAP
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error en el controlador pagar:', error);
      return res.status(500).json({
        success: false,
        cod_error: '99',
        message_error: 'Error interno del servidor',
        data: null
      });
    }
  }

  // Confirmar un pago
  async confirmarPago(req, res) {
    try {
      const { sessionId, token } = req.body;
      
      // Validaciones básicas
      if (!sessionId || !token) {
        return res.status(400).json({
          success: false,
          cod_error: '01',
          message_error: 'Todos los campos son requeridos',
          data: null
        });
      }
      
      // Llamar al servicio SOAP
      const result = await soapClient.confirmarPago(sessionId, token);
      
      // Responder con el resultado del servicio SOAP
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error en el controlador confirmarPago:', error);
      return res.status(500).json({
        success: false,
        cod_error: '99',
        message_error: 'Error interno del servidor',
        data: null
      });
    }
  }

  // Consultar el saldo
  async consultarSaldo(req, res) {
    try {
      const { documento, celular } = req.body;
      
      // Validaciones básicas
      if (!documento || !celular) {
        return res.status(400).json({
          success: false,
          cod_error: '01',
          message_error: 'Todos los campos son requeridos',
          data: null
        });
      }
      
      // Llamar al servicio SOAP
      const result = await soapClient.consultarSaldo(documento, celular);
      
      // Responder con el resultado del servicio SOAP
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error en el controlador consultarSaldo:', error);
      return res.status(500).json({
        success: false,
        cod_error: '99',
        message_error: 'Error interno del servidor',
        data: null
      });
    }
  }
}

module.exports = new WalletController(); 