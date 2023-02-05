import { Options, EntityCaseNamingStrategy } from '@mikro-orm/core';
import config from './app.config';

const { user, password, port, dbName, host, debug } = config.database;

const ormConfig: Options = {
  migrations: {
    tableName: 'migrations',
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    transactional: true,
    emit: 'ts',
  },
  entities: ['dist/**/*.entity.js'],
  dbName,
  password,
  user,
  host,
  port,
  debug,
  type: 'postgresql',
  namingStrategy: EntityCaseNamingStrategy,
  allowGlobalContext: true,
  forceUtcTimezone: true,
};

export default ormConfig;
