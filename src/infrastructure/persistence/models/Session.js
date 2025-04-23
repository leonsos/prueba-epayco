const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');
const Client = require('./Client');

/**
 * Modelo de Sequelize para la tabla de sesiones
 */
const Session = sequelize.define('Session', {
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Client,
      key: 'id'
    }
  },
  token: {
    type: DataTypes.STRING(6),
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
      return new Date(new Date().getTime() + 30 * 60000); // 30 minutos
    }
  }
}, {
  tableName: 'sessions',
  timestamps: true,
  indexes: [
    {
      fields: ['token']
    },
    {
      fields: ['clientId']
    },
    {
      fields: ['isUsed']
    }
  ]
});

// Definir relación con Cliente
Session.belongsTo(Client, { foreignKey: 'clientId' });
Client.hasMany(Session, { foreignKey: 'clientId' });

module.exports = Session; 