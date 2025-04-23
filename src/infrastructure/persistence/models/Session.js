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
    type: DataTypes.STRING(255),
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
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
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

// Establecer la relación con Client
Session.belongsTo(Client, {
  foreignKey: {
    name: 'clientId',
    allowNull: false
  }
});
Client.hasMany(Session, { foreignKey: 'clientId' });

module.exports = Session; 