import initMongoServer from './helpers/initMongoServer';
import seedDb from './helpers/seedDb';
import request from 'supertest';
let app:any;
let api:any;
beforeAll(async () => {
  /* eslint-disable  @typescript-eslint/no-var-requires */
  app = require('../src/server').default;
  api = request(app);
  await initMongoServer();
  await seedDb();
});

describe('API testing /api/cities/suggestions', () => {
  test('get suggestions will return 2 matching documents', async () => {
    const response = await api.get('/api/cities/suggestions').query({
      q: 'lon',
      latitude: 43.70011,
      longitude: -79.4163,
      radius: 500,
      sort: 'name',
    });
    expect(response.body.suggestions).toHaveLength(2);
  });

  test('get suggestions will return no matching documents', async () => {
    const response = await api.get('/api/cities/suggestions').query({
      q: 'xxxxxx',
      latitude: 43.70011,
      longitude: -79.4163,
      radius: 500,
      sort: 'name',
    });
    expect(response.body.suggestions).toHaveLength(0);
  });

  test('request without q will fail', async () => {
    const response = await api.get('/api/cities/suggestions').query({
      latitude: 43.70011,
      longitude: -79.4163,
      radius: 500,
      sort: 'name',
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      'message',
      'Failed to validate input "q" is required',
    );
  });

  test('request with a non number value for latitude will fail', async () => {
    const response = await api.get('/api/cities/suggestions').query({
      q: 'lon',
      latitude: 'lat',
      longitude: -79.4163,
      radius: 500,
      sort: 'name',
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      'message',
      'Failed to validate input "latitude" must be a number',
    );
  });

  test('request with a non number value for longitude will fail', async () => {
    const response = await api.get('/api/cities/suggestions').query({
      q: 'lon',
      latitude: 43.70011,
      longitude: 'long',
      radius: 500,
      sort: 'name',
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      'message',
      'Failed to validate input "longitude" must be a number',
    );
  });

  test('request with a non number value for radius will fail', async () => {
    const response = await api.get('/api/cities/suggestions').query({
      q: 'lon',
      latitude: 43.70011,
      longitude: -79.4163,
      radius: 'rad',
      sort: 'name',
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      'message',
      'Failed to validate input "radius" must be a number',
    );
  });

  test('request with a value for sort other than name or distance  will fail', async () => {
    const response = await api.get('/api/cities/suggestions').query({
      q: 'lon',
      latitude: 43.70011,
      longitude: -79.4163,
      radius: 500,
      sort: 'sort',
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      'message',
      'Failed to validate input "sort" must be one of [name, distance]',
    );
  });

  test('request with no value for latitude and value for sort other than name will fail', async () => {
    const response = await api.get('/api/cities/suggestions').query({
      q: 'lon',
      longitude: -79.4163,
      radius: 500,
      sort: 'distance',
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      'message',
      'Failed to validate input "sort" must be [name]',
    );
  });

  test('request with no value for longitude and value for sort other than name will fail', async () => {
    const response = await api.get('/api/cities/suggestions').query({
      q: 'lon',
      latitude: -79.4163,
      radius: 500,
      sort: 'distance',
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      'message',
      'Failed to validate input "sort" must be [name]',
    );
  });
});
