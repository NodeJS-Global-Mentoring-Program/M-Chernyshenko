import {
  Model,
  DataTypes,
  Sequelize,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
} from 'sequelize';
import { GroupModel } from '../../Groups/data-access';
import { UserAttributes, UserCreationAttributes } from './types';

export class UserModel
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public uuid!: string;
  public isDeleted!: boolean;
  public login!: string;
  public age!: number;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getGroups!: BelongsToManyGetAssociationsMixin<GroupModel>;
  public addGroup!: BelongsToManyAddAssociationMixin<GroupModel, string>;

  public static associate = (): void => {
    UserModel.associations.groups = UserModel.belongsToMany(GroupModel, {
      through: 'user-group',
      as: 'group',
      sourceKey: 'uuid',
      foreignKey: 'user_uuid',
    });
  };
}

export const initUserModel = (
  sequelize: Sequelize
): Model<UserAttributes, UserCreationAttributes> =>
  UserModel.init(
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
        defaultValue: false,
      },
    },
    { tableName: 'users', sequelize }
  );
