const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

/**
 * Modelo de Sequelize para la tabla de clientes
 */
const Client = sequelize.define('Client', {
  documento: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  nombres: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  celular: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  saldo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'clients',
  timestamps: true,
  indexes: [
    {
      fields: ['documento']
    },
    {
      fields: ['email']
    },
    {
      fields: ['documento', 'celular']
    }
  ]
});

module.exports = Client; 