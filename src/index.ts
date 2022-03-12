import app from './server';
import logger from './shared/Logger';
import { intializeDB } from './db';
import { migrateToMongo } from './migrate';

intializeDB();
migrateToMongo();

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  logger.info('Express server started on port: ' + port);
});
