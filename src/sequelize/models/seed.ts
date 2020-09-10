import { Sequelize, Model, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  class Seed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  }
  Seed.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Seed',
    }
  );
  return Seed;
};
