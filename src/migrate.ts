import cities from './models/cities';
import logger from './shared/Logger';
import fs from 'fs';

export async function migrateToMongo() {
    const currentDbEntries = await cities.find();
  if(currentDbEntries.length===0){
    const data = fs.readFileSync('src/cities_canada-usa.tsv', 'utf8');
    const lines = data.split("\n");
    const result = [];
    const headers = lines[0].split("\t");
    for (let i = 1; i < lines.length; i++) {
      const obj= {};
      const currentline = lines[i].split("\t");
  
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
  
      result.push(obj);
    }
    result.forEach(async (element,i) => {
      if (element.long && element.lat) {
        await cities.create({
          name: element.name,
          country:element.country,
          state:element.admin1,
          location: {
            type: 'Point',
            coordinates: [Number(element.long), Number(element.lat)]
          }
        })
      }
      if(i === result.length-1){
        logger.info(`Migration Complete.Migrated ${i} elements`); 
      }
    });
  }
  else{
    logger.info('Already inserted'); 
  }

}


