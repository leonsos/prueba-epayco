const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const walletRoutes = require('./routes/walletRoutes');

// Crear aplicación Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de rutas
app.use('/api/wallet', walletRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'API de Billetera Virtual ePayco - Prueba Técnica'
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    cod_error: '404',
    message_error: 'Ruta no encontrada',
    data: null
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({
    success: false,
    cod_error: '500',
    message_error: 'Error interno del servidor',
    data: null
  });
});

module.exports = app; 