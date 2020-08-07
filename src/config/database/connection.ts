import { Sequelize } from 'sequelize';

const { DB, DB_USERNAME, DB_PASSWORD, DB_HOST } = process.env;

class DBConnection {
  private static connection = new Sequelize(
    `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB}`
  );

  private constructor() {}

  public static getInstance(): Sequelize {
    return this.connection;
  }
}

export const dbConnection = DBConnection.getInstance();
