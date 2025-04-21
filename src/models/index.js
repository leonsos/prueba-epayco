const { sequelize } = require('../utils/database');
const Client = require('./Client');
const Session = require('./Session');

// Establecer relaciones
Client.hasMany(Session, { foreignKey: 'clientId' });
Session.belongsTo(Client, { foreignKey: 'clientId' });

// Función para sincronizar los modelos con la base de datos
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('Base de datos sincronizada correctamente');
    return true;
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
    return false;
  }
};

module.exports = {
  Client,
  Session,
  syncDatabase
}; 