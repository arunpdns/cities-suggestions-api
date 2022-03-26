import cities from '../../src/models/cities';
export default async function seedDb() {
  return await cities.insertMany([
    {
      name: 'London',
      state: '08',
      country: 'CA',
      location: {
        type: 'Point',
        coordinates: [-81.23304, 42.98339],
      },
    },
    {
      name: 'Solon',
      state: 'OH',
      country: 'US',
      location: {
        type: 'Point',
        coordinates: [-81.44123, 41.38978],
      },
    },
  ]);
}
