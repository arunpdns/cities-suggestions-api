import City from './models/cities';
import logger from './shared/Logger';
import fs from 'fs';
import { TsvParser } from './shared/TsvParser';

export async function migrateToMongo(): Promise<void> {
  const currentDbEntries = await City.find();
  if (currentDbEntries.length !== 0) {
    logger.info('DB already seeded. skipping.');
    return;
  }
  const data = fs.readFileSync('src/cities_canada-usa.tsv', 'utf8');
  const result = new TsvParser().parse(data);
  const cities = result
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((element:any) => element.long && element.lat)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((element:any) => {
      return {
        name: element.name,
        country: element.country,
        state: element.admin1,
        location: {
          type: 'Point',
          coordinates: [Number(element.long), Number(element.lat)],
        },
      };
    });
  await City.create(cities);
  logger.info('Successfully seeded DB');
}
