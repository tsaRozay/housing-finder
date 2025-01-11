module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('Users', 'User');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('User', 'Users');
  }
};
