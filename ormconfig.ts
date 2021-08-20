const __prod__ = () => !!(process.env.NODE_ENV === 'production');
const __test__ = () => !!(process.env.NODE_ENV === 'test');
const pgString = require('pg-connection-string');

const databaseUrl = process.env.DATABASE_URL || '';
const connectionOptions = pgString.parse(databaseUrl);
const config = () => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return {
        type: 'postgres',
        host: connectionOptions.host,
        port: parseInt(connectionOptions.port),
        username: connectionOptions.user,
        password: connectionOptions.password,
        database: connectionOptions.database,
        logging: true,
        synchronize: false,
        entities: ['dist/src/**/models/*.entity.js'],
        migrations: ['dist/src/migrations/*.js'],
        cli: {
          migrationsDir: 'src/migrations',
        },
      };
    default:
      return {
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
        logging: true,
        synchronize: false,
        entities: ['dist/src/**/models/*.entity.js'],
        migrations: ['dist/src/migrations/*.js'],
        cli: {
          migrationsDir: 'src/migrations',
        },
      };
  }
};

module.exports = config();
