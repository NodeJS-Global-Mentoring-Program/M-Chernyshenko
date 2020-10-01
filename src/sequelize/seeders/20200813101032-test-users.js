'use strict';

const faker = require('faker');
const { v4 } = require('uuid');

const generateFakeUser = () => {
  const login = faker.internet.email();
  const password = faker.internet.password();
  const age = faker.random.number({
    min: 18,
    max: 80,
  });

  const now = new Date();
  const user = {
    login,
    password,
    age,
    isDeleted: false,
    uuid: v4(),
    createdAt: now,
    updatedAt: now,
  };
  return user;
};

const createUsers = (count = 10) =>
  Array.from({ length: count }).map(() => {
    return generateFakeUser();
  });

const testUsers = createUsers();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', testUsers);
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
