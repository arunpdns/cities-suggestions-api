import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/server';
import request from 'supertest';
import cities from '../src/models/cities';
beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'cities' });

  await cities.insertMany([
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
});

describe('API testing', () => {
  test('get suggestions will return 2 matching documents', async () => {
    const response = await request(app)
      .get('/api/cities/suggestions')
      .query({
        q: 'lon',
        latitude: 43.70011,
        longitude: -79.4163,
        radius: 500,
        sort: 'name',
      })
      .catch((err) => {
        throw err;
      });
    expect(response.body).toHaveLength(2);
  });

  test('get suggestions will return no matching documents', async () => {
    const response = await request(app)
      .get('/api/cities/suggestions')
      .query({
        q: 'xxxxxx',
        latitude: 43.70011,
        longitude: -79.4163,
        radius: 500,
        sort: 'name',
      })
      .catch((err) => {
        throw err;
      });
    expect(response.body).toHaveLength(0);
  });

  test('request without q will fail', async () => {
    const response = await request(app)
      .get('/api/cities/suggestions')
      .query({
        latitude: 43.70011,
        longitude: -79.4163,
        radius: 500,
        sort: 'name',
      })
      .catch((err) => {
        throw err;
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      'message',
      'Failed to validate input "q" is required',
    );
  });

  test('request with a non number value for latitude will fail', async () => {
    const response = await request(app)
      .get('/api/cities/suggestions')
      .query({
        q: 'lon',
        latitude: 'lat',
        longitude: -79.4163,
        radius: 500,
        sort: 'name',
      })
      .catch((err) => {
        throw err;
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      'message',
      'Failed to validate input "latitude" must be a number',
    );
  });

  test('request with a non number value for longitude will fail', async () => {
    const response = await request(app)
      .get('/api/cities/suggestions')
      .query({
        q: 'lon',
        latitude: 43.70011,
        longitude: 'long',
        radius: 500,
        sort: 'name',
      })
      .catch((err) => {
        throw err;
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      'message',
      'Failed to validate input "longitude" must be a number',
    );
  });

  test('request with a non number value for radius will fail', async () => {
    const response = await request(app)
      .get('/api/cities/suggestions')
      .query({
        q: 'lon',
        latitude: 43.70011,
        longitude: -79.4163,
        radius: 'rad',
        sort: 'name',
      })
      .catch((err) => {
        throw err;
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      'message',
      'Failed to validate input "radius" must be a number',
    );
  });

  test('request with a value for sort other than name or distance  will fail', async () => {
    const response = await request(app)
      .get('/api/cities/suggestions')
      .query({
        q: 'lon',
        latitude: 43.70011,
        longitude: -79.4163,
        radius: 500,
        sort: 'sort',
      })
      .catch((err) => {
        throw err;
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      'message',
      'Failed to validate input "sort" must be one of [name, distance]',
    );
  });
});
