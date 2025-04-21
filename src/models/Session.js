const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const Client = require('./Client');

// Definir el modelo Session
const Session = sequelize.define('Session', {
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  isUsed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: () => {
      const now = new Date();
      return new Date(now.getTime() + 30 * 60000); // 30 minutos
    }
  }
}, {
  tableName: 'sessions',
  timestamps: true
});

// Establecer la relación con Client
Session.belongsTo(Client, {
  foreignKey: {
    name: 'clientId',
    allowNull: false
  }
});

module.exports = Session; 