import path from 'path';
import { readdirSync } from 'fs';
import { DataTypes } from 'sequelize';

import createFlyway from './models/flyway';
import createSeed from './models/seed';
import { DBConnection } from '../config/database';

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

export const applySeeds = async (): Promise<void> => {
  const seedsDir = 'seeders';
  const seedsDirAbs = path.resolve(path.join(__dirname, seedsDir));
  const seedFilesNames = getFilesNames(seedsDirAbs);
  const seedsNames = removeExtensions(seedFilesNames);

  const sequelize = DBConnection.getInstance();
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

export const applyMigrations = async (): Promise<void> => {
  const migrationsDir = 'migrations';
  const migrationsDirAbs = path.resolve(path.join(__dirname, migrationsDir));
  const migrationFilesNames = getFilesNames(migrationsDirAbs);
  const migrationNames = removeExtensions(migrationFilesNames);

  const sequelize = DBConnection.getInstance();
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
