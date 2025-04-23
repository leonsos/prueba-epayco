const express = require('express');

/**
 * Configura las rutas de la API para la billetera
 * @param {Object} dependencies - Dependencias
 * @param {import('../controllers/WalletController')} dependencies.walletController - Controlador de la billetera
 * @returns {express.Router} - Router configurado
 */
function setupWalletRoutes({ walletController }) {
  const router = express.Router();

  /**
   * @swagger
   * /api/wallet/registro:
   *   post:
   *     summary: Registra un nuevo cliente
   *     tags: [Wallet]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - documento
   *               - nombres
   *               - email
   *               - celular
   *             properties:
   *               documento:
   *                 type: string
   *               nombres:
   *                 type: string
   *               email:
   *                 type: string
   *               celular:
   *                 type: string
   *     responses:
   *       200:
   *         description: Cliente registrado correctamente
   */
  router.post('/registro', (req, res) => walletController.registerClient(req, res));

  /**
   * @swagger
   * /api/wallet/recarga:
   *   post:
   *     summary: Recarga la billetera de un cliente
   *     tags: [Wallet]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - documento
   *               - celular
   *               - valor
   *             properties:
   *               documento:
   *                 type: string
   *               celular:
   *                 type: string
   *               valor:
   *                 type: number
   *     responses:
   *       200:
   *         description: Recarga exitosa
   */
  router.post('/recarga', (req, res) => walletController.rechargeWallet(req, res));

  /**
   * @swagger
   * /api/wallet/pagar:
   *   post:
   *     summary: Genera un token para realizar un pago
   *     tags: [Wallet]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - documento
   *               - celular
   *               - valor
   *             properties:
   *               documento:
   *                 type: string
   *               celular:
   *                 type: string
   *               valor:
   *                 type: number
   *     responses:
   *       200:
   *         description: Token generado correctamente
   */
  router.post('/pagar', (req, res) => walletController.generatePayment(req, res));

  /**
   * @swagger
   * /api/wallet/confirmacion:
   *   post:
   *     summary: Confirma un pago utilizando el token
   *     tags: [Wallet]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - sessionId
   *               - token
   *             properties:
   *               sessionId:
   *                 type: string
   *               token:
   *                 type: string
   *     responses:
   *       200:
   *         description: Pago confirmado correctamente
   */
  router.post('/confirmacion', (req, res) => walletController.confirmPayment(req, res));

  /**
   * @swagger
   * /api/wallet/saldo:
   *   post:
   *     summary: Consulta el saldo de un cliente
   *     tags: [Wallet]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - documento
   *               - celular
   *             properties:
   *               documento:
   *                 type: string
   *               celular:
   *                 type: string
   *     responses:
   *       200:
   *         description: Consulta exitosa
   */
  router.post('/saldo', (req, res) => walletController.getBalance(req, res));

  return router;
}

module.exports = setupWalletRoutes; 