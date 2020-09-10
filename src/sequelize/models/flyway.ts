import { Sequelize, Model, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  class Flyway extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  }
  Flyway.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Flyway',
    }
  );
  return Flyway;
};
