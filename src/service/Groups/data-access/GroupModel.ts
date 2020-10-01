import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  DataTypes,
  Model,
  Optional,
  Sequelize,
} from 'sequelize';
import { GroupPermissionModel } from '../../GroupPermissions/data-access';
import { UserModel } from '../../Users/data-access/UserModel';
import { GroupDto } from '../types';

interface GroupModelAttributes extends GroupDto {
  id: number;
}

type GroupModelCreationalAttributes = Optional<GroupModelAttributes, 'id'>;

export class GroupModel
  extends Model<GroupModelAttributes, GroupModelCreationalAttributes>
  implements GroupDto {
  public uuid!: string;
  public name!: string;
  public isDeleted!: boolean;

  public createdAt!: Date;
  public updatedAt!: Date;

  public getPermissions!: BelongsToManyGetAssociationsMixin<
    GroupPermissionModel
  >;
  public setPermissions!: BelongsToManySetAssociationsMixin<
    GroupPermissionModel,
    string
  >;
  public addPermission!: BelongsToManyAddAssociationMixin<
    GroupPermissionModel,
    string
  >;
  public addPermissions!: BelongsToManyAddAssociationsMixin<
    GroupPermissionModel,
    string
  >;

  public getUsers!: BelongsToManyGetAssociationsMixin<UserModel>;
  public addUser!: BelongsToManyAddAssociationMixin<UserModel, string>;
  public addUsers!: BelongsToManyAddAssociationsMixin<UserModel, string>;

  public static associate = (): void => {
    GroupModel.associations.permissions = GroupModel.belongsToMany(
      GroupPermissionModel,
      {
        through: 'group-group_permission',
        as: 'permission',
        sourceKey: 'uuid',
        foreignKey: 'group_uuid',
      }
    );
    GroupModel.associations.users = GroupModel.belongsToMany(UserModel, {
      through: 'user-group',
      as: 'user',
      sourceKey: 'uuid',
      foreignKey: 'group_uuid',
    });
  };
}

export const initGroupModel = (
  sequelize: Sequelize
): Model<GroupModelAttributes, GroupModelCreationalAttributes> => {
  return GroupModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: { type: DataTypes.STRING, allowNull: false, unique: true },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    { sequelize, tableName: 'groups' }
  );
};
