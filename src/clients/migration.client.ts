import { Migrator } from 'ts-migrate-mongoose';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class MigrationClient {
  static async run() {
    const migrator = await Migrator.connect({
      uri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/nest',
      autosync: true,
    });

    console.info('Running migrations...');

    await migrator
      .run('down', 'test')
      .then((migrations) => {
        for (const migration of migrations) {
          console.info('down:', migration.filename);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    await migrator.prune();

    await migrator
      .run('up')
      .then((migrations) => {
        for (const migration of migrations) {
          console.info('up:', migration.filename);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    await migrator.close();
  }
}
