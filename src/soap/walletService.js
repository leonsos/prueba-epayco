const nodemailer = require('nodemailer');
const { Client, Session } = require('../models');
const { Op } = require('sequelize');

// Configuración de transporter para envío de emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'tu_correo@gmail.com',
    pass: process.env.EMAIL_PASS || 'tu_contraseña'
  }
});

// Función auxiliar para generar respuestas estandarizadas
const createResponse = (success, codError, messageError, data = null) => {
  return {
    success,
    cod_error: codError,
    message_error: messageError,
    data
  };
};

// Función para generar token de 6 dígitos
const generateToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Función para enviar email con el token
const sendTokenEmail = async (email, token, sessionId) => {
  try {
    // Simulación de envío de correo (solo se muestra en consola)
    console.log(`========================================`);
    console.log(`SIMULACIÓN DE ENVÍO DE EMAIL:`);
    console.log(`Destinatario: ${email}`);
    console.log(`Token de confirmación: ${token}`);
    console.log(`ID de Sesión: ${sessionId}`);
    console.log(`========================================`);
    
    // Retornamos true para indicar que el "envío" fue exitoso
    return true;
  } catch (error) {
    console.error('Error al simular envío de email:', error);
    return false;
  }
};

// Implementación de servicios SOAP
const walletService = {
  WalletService: {
    WalletServiceSoap: {
      // Registro de cliente
      RegistroCliente: async (args) => {
        try {
          const { documento, nombres, email, celular } = args;
          
          // Validar que todos los campos estén presentes
          if (!documento || !nombres || !email || !celular) {
            return createResponse(false, '01', 'Todos los campos son requeridos');
          }
          
          // Verificar si el cliente ya existe
          const existingClient = await Client.findOne({ 
            where: {
              [Op.or]: [{ documento }, { email }]
            }
          });
          
          if (existingClient) {
            return createResponse(false, '02', 'El cliente ya está registrado con ese documento o email');
          }
          
          // Crear nuevo cliente
          const newClient = await Client.create({
            documento,
            nombres,
            email,
            celular
          });
          
          return createResponse(true, '00', 'Cliente registrado exitosamente', {
            cliente: {
              documento: newClient.documento,
              nombres: newClient.nombres,
              email: newClient.email,
              celular: newClient.celular
            }
          });
        } catch (error) {
          console.error('Error en RegistroCliente:', error);
          return createResponse(false, '99', 'Error interno del servidor');
        }
      },
      
      // Recarga de billetera
      RecargaBilletera: async (args) => {
        try {
          const { documento, celular, valor } = args;
          
          // Validar que todos los campos estén presentes
          if (!documento || !celular || !valor) {
            return createResponse(false, '01', 'Todos los campos son requeridos');
          }
          
          // Validar que el valor sea un número positivo
          const amount = parseFloat(valor);
          if (isNaN(amount) || amount <= 0) {
            return createResponse(false, '03', 'El valor debe ser un número positivo');
          }
          
          // Buscar el cliente
          const client = await Client.findOne({ 
            where: { 
              documento, 
              celular 
            } 
          });
          
          if (!client) {
            return createResponse(false, '04', 'Cliente no encontrado');
          }
          
          // Actualizar el saldo
          client.saldo = parseFloat(client.saldo) + amount;
          await client.save();
          
          return createResponse(true, '00', 'Recarga exitosa', {
            nuevoSaldo: client.saldo
          });
        } catch (error) {
          console.error('Error en RecargaBilletera:', error);
          return createResponse(false, '99', 'Error interno del servidor');
        }
      },
      
      // Pagar (generar token)
      Pagar: async (args) => {
        try {
          const { documento, celular, valor } = args;
          
          // Validar que todos los campos estén presentes
          if (!documento || !celular || !valor) {
            return createResponse(false, '01', 'Todos los campos son requeridos');
          }
          
          // Validar que el valor sea un número positivo
          const amount = parseFloat(valor);
          if (isNaN(amount) || amount <= 0) {
            return createResponse(false, '03', 'El valor debe ser un número positivo');
          }
          
          // Buscar el cliente
          const client = await Client.findOne({ 
            where: { 
              documento, 
              celular 
            } 
          });
          
          if (!client) {
            return createResponse(false, '04', 'Cliente no encontrado');
          }
          
          // Verificar que tenga saldo suficiente
          if (parseFloat(client.saldo) < amount) {
            return createResponse(false, '05', 'Saldo insuficiente');
          }
          
          // Generar token y sesión
          const token = generateToken();
          const session = await Session.create({
            clientId: client.id,
            token,
            valor: amount
          });
          
          // Enviar email con el token
          const emailSent = await sendTokenEmail(client.email, token, session.id.toString());
          
          if (!emailSent) {
            return createResponse(false, '06', 'Error al enviar el email con el token');
          }
          
          return createResponse(true, '00', 'Token generado y enviado por email', {
            sessionId: session.id.toString()
          });
        } catch (error) {
          console.error('Error en Pagar:', error);
          return createResponse(false, '99', 'Error interno del servidor');
        }
      },
      
      // Confirmar Pago
      ConfirmarPago: async (args) => {
        try {
          const { sessionId, token } = args;
          
          // Validar que todos los campos estén presentes
          if (!sessionId || !token) {
            return createResponse(false, '01', 'Todos los campos son requeridos');
          }
          
          // Buscar la sesión
          const session = await Session.findByPk(sessionId);
          if (!session) {
            return createResponse(false, '07', 'Sesión no encontrada');
          }
          
          // Verificar si la sesión ya fue utilizada
          if (session.isUsed) {
            return createResponse(false, '08', 'Esta sesión ya fue utilizada');
          }
          
          // Verificar si la sesión ha expirado
          if (new Date() > session.expiresAt) {
            return createResponse(false, '09', 'La sesión ha expirado');
          }
          
          // Verificar que el token coincida
          if (session.token !== token) {
            return createResponse(false, '10', 'Token inválido');
          }
          
          // Buscar el cliente y actualizar saldo
          const client = await Client.findByPk(session.clientId);
          if (!client) {
            return createResponse(false, '04', 'Cliente no encontrado');
          }
          
          // Verificar nuevamente que tenga saldo suficiente
          if (parseFloat(client.saldo) < parseFloat(session.valor)) {
            return createResponse(false, '05', 'Saldo insuficiente');
          }
          
          // Actualizar saldo y marcar sesión como usada
          client.saldo = parseFloat(client.saldo) - parseFloat(session.valor);
          await client.save();
          
          session.isUsed = true;
          await session.save();
          
          return createResponse(true, '00', 'Pago confirmado exitosamente', {
            nuevoSaldo: client.saldo,
            valorPagado: session.valor
          });
        } catch (error) {
          console.error('Error en ConfirmarPago:', error);
          return createResponse(false, '99', 'Error interno del servidor');
        }
      },
      
      // Consultar Saldo
      ConsultarSaldo: async (args) => {
        try {
          const { documento, celular } = args;
          
          // Validar que todos los campos estén presentes
          if (!documento || !celular) {
            return createResponse(false, '01', 'Todos los campos son requeridos');
          }
          
          // Buscar el cliente
          const client = await Client.findOne({ 
            where: { 
              documento, 
              celular 
            } 
          });
          
          if (!client) {
            return createResponse(false, '04', 'Cliente no encontrado');
          }
          
          return createResponse(true, '00', 'Consulta exitosa', {
            cliente: {
              documento: client.documento,
              nombres: client.nombres,
              email: client.email,
              celular: client.celular
            },
            saldo: client.saldo
          });
        } catch (error) {
          console.error('Error en ConsultarSaldo:', error);
          return createResponse(false, '99', 'Error interno del servidor');
        }
      }
    }
  }
};

module.exports = walletService; 