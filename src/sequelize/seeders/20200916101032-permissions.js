'use strict';

const uuid = require('uuid');

const permissionsNames = ['WRITE', 'READ', 'DELETE', 'SHARE', 'UPLOAD_FILES'];

const permissionsRows = permissionsNames.map((permission) => ({
  name: permission,
  uuid: uuid.v4(),
  createdAt: new Date(),
  updatedAt: new Date(),
}));

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('group_permissions', permissionsRows);
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
