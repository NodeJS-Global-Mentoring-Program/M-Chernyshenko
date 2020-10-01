import path from 'path';
import { readdirSync } from 'fs';
import { DataTypes, Sequelize } from 'sequelize';

import createFlyway from './models/Flyway';
import createSeed from './models/Seed';

import { DBConnection } from './database';
import { initUserModel, UserModel } from '../service/Users/data-access';
import { GroupModel, initGroupModel } from '../service/Groups/data-access';
import { initGroupPermissionModel } from '../service/GroupPermissions/data-access';

const getFilesNames = (dirPathAbs: string): string[] => {
  const files = readdirSync(dirPathAbs);
  return files;
};

const removeExtensions = (files: string[]): string[] => {
  const withoutExtensions = files.map((file) => {
    const splittedName = file.split('.');
    const nameWithoutExtension = splittedName
      .slice(0, splittedName.length - 1)
      .join('.');
    return nameWithoutExtension;
  });
  return withoutExtensions;
};

const applySeeds = async (sequelize: Sequelize): Promise<void> => {
  const seedsDir = 'seeders';
  const seedsDirAbs = path.resolve(path.join(__dirname, seedsDir));
  const seedFilesNames = getFilesNames(seedsDirAbs);
  const seedsNames = removeExtensions(seedFilesNames);

  const SeedModel = createSeed(sequelize);
  await SeedModel.sync();
  const seeds = await SeedModel.findAll();
  const DBSeedsNames = seeds.map((seed) => seed.getDataValue('name'));
  const newMigrations = seedsNames.filter(
    (newSeed) => !DBSeedsNames.includes(newSeed)
  );
  const newSeedsPromises = newMigrations.map(async (newMigration) => {
    const { up } = await import(path.join(seedsDirAbs, `${newMigration}.js`));
    await up(sequelize.getQueryInterface(), DataTypes);
    await SeedModel.create({ name: newMigration });
  });
  await Promise.all(newSeedsPromises);
};

const applyMigrations = async (sequelize: Sequelize): Promise<void> => {
  const migrationsDir = 'migrations';
  const migrationsDirAbs = path.resolve(path.join(__dirname, migrationsDir));
  const migrationFilesNames = getFilesNames(migrationsDirAbs);
  const migrationNames = removeExtensions(migrationFilesNames);

  const FlywayModel = createFlyway(sequelize);
  await FlywayModel.sync();
  const flyways = await FlywayModel.findAll();
  const flywaysNames = flyways.map((flyway) => flyway.getDataValue('name'));
  const newMigrations = migrationNames.filter(
    (newMigration) => !flywaysNames.includes(newMigration)
  );
  const newFlyways = newMigrations.map(async (newMigration) => {
    const { up } = await import(
      path.join(migrationsDirAbs, `${newMigration}.js`)
    );
    await up(sequelize.getQueryInterface(), DataTypes);
    await FlywayModel.create({ name: newMigration });
  });
  await Promise.all(newFlyways);
};

const initModels = async (sequelize: Sequelize): Promise<void> => {
  const initFunctions = [
    initUserModel,
    initGroupModel,
    initGroupPermissionModel,
  ];
  initFunctions.forEach((fn) => fn(sequelize));
  await sequelize.sync();
};

const associateModels = async (sequelize: Sequelize): Promise<void> => {
  Object.values(sequelize.models).forEach((model: any) => {
    if (typeof model.associate === 'function') {
      model.associate(sequelize);
    }
  });
  await sequelize.sync();
};

/**
 * Helper function apply migrations, seeds, init models
 */
export async function configureDB(): Promise<void> {
  const sequelize = DBConnection.getInstance({ logging: false });
  await sequelize.authenticate();

  await initModels(sequelize);
  await associateModels(sequelize);
  await applyMigrations(sequelize);
  await applySeeds(sequelize);
}
