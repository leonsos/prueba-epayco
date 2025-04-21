const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

// Rutas para las operaciones de la billetera
router.post('/registro', walletController.registroCliente);
router.post('/recarga', walletController.recargaBilletera);
router.post('/pagar', walletController.pagar);
router.post('/confirmar', walletController.confirmarPago);
router.post('/saldo', walletController.consultarSaldo);

module.exports = router; 