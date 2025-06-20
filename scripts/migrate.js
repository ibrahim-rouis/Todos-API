import pg from 'pg';
import Postgrator from 'postgrator';
import * as path from 'node:path';
import 'dotenv/config';

if (
  !process.env.POSTGRES_DB ||
  !process.env.POSTGRES_USER ||
  !process.env.POSTGRES_PASSWORD
) {
  console.error('Please set all required environment variables in .env file');
  process.exit(-1);
}

async function migrate() {
  const client = new pg.Client({
    host: 'localhost',
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  });

  try {
    await client.connect();
    const postgrator = new Postgrator({
      migrationPattern: path.join(process.cwd(), '/migrations/*'),
      driver: 'pg',
      database: process.env.POSTGRES_DB,
      schemaTable: 'migrations',
      currentSchema: 'public',
      execQuery: (query) => client.query(query),
    });

    const result = await postgrator.migrate();

    if (result.length === 0) {
      console.log(
        'No migrations run for schema "public". Already at the latest one.',
      );
    }

    console.log('Migration done.');

    process.exitCode = 0;
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }

  await client.end();
}

migrate();
