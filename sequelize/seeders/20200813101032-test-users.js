'use strict';

import faker from 'faker';

const generateFakeUser = (): User => {
  const login = faker.internet.email();
  const password = faker.internet.password();
  const age = faker.random.number({
    min: 18,
    max: 80,
  });

  const user = new User(login, password, age);
  return user;
};

const createUsers = (count = 10): User[] =>
  Array.from({ length: count }).map(() => {
    return generateFakeUser();
  });

export { createUsers };


module.exports = {
  up: async (queryInterface, Sequelize) => {
    const testUsers = 
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
  }
};
