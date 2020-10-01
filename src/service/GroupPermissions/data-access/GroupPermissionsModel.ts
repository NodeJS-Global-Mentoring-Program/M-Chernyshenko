import { DataTypes, Model, Sequelize } from 'sequelize';
import { GroupModel } from '../../Groups/data-access';
import { GroupPermissionDto } from '../types';

interface ISequelizePermission extends GroupPermissionDto {
  id: number;
}

export class GroupPermissionModel
  extends Model<ISequelizePermission, GroupPermissionDto>
  implements GroupPermissionDto {
  public name!: string;
  public uuid!: string;
  public isDeleted!: boolean;

  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate = (): void => {
    GroupPermissionModel.associations.groups = GroupPermissionModel.belongsToMany(
      GroupModel,
      {
        through: 'group-group_permission',
        as: 'group',
        sourceKey: 'uuid',
        foreignKey: 'permission_uuid',
      }
    );
  };
}

export const initGroupPermissionModel = (
  sequelize: Sequelize
): Model<ISequelizePermission, GroupPermissionDto> =>
  GroupPermissionModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    { sequelize, tableName: 'group_permissions' }
  );
