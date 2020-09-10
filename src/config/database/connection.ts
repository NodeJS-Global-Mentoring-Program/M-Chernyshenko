import { Sequelize } from 'sequelize';

class DBConnection {
  private static connection: Sequelize | null = null;

  private constructor() {}

  public static getInstance(): Sequelize {
    const { DB_URL } = process.env;
    if (this.connection === null) {
      this.connection = new Sequelize(DB_URL, { dialect: 'postgres' });
    }
    return this.connection;
  }

  public static async close(): Promise<void> {
    if (this.connection === null) {
      throw new Error('Connection not established');
    }
    this.connection.close();
  }
}

export { DBConnection };
