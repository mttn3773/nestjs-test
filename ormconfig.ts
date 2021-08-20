const __prod__ = () => !!(process.env.NODE_ENV === 'production');
const __test__ = () => !!(process.env.NODE_ENV === 'test');

const config = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: !__test__()
    ? process.env.POSTGRES_DATABASE
    : process.env.POSTGRES_TEST_DATABASE,
  logging: true,
  synchronize: true,
  entities: ['dist/src/**/models/*.entity.js'],
  migrations: ['dist/src/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

module.exports = config;
