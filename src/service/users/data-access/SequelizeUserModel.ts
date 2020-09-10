import { Model, DataTypes } from 'sequelize';
import { DBConnection } from '../../../config/database';
import { UserAttributes, UserCreationAttributes } from './types';

class SequelizeUserModel
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public user_id!: string;
  public isDeleted!: boolean;
  public login!: string;
  public age!: number;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initUserModel = (): void => {
  SequelizeUserModel.init(
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      login: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    { tableName: 'users', sequelize: DBConnection.getInstance() }
  );
  SequelizeUserModel.sync();
};

export { SequelizeUserModel };
