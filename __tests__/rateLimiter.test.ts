import initMongoServer from './helpers/initMongoServer';
import seedDb from './helpers/seedDb';
import request from 'supertest';
import sinon from 'sinon';
let app;
let clock;
let api;
beforeAll(async () => {
  clock = sinon.useFakeTimers(new Date().getTime());
  /* eslint-disable  @typescript-eslint/no-var-requires */
  app = require('../src/server').default;
  api = request(app);
  await initMongoServer();
  await seedDb();
});

describe('API rate limit testing /api/cities/suggestions', () => {
  test('API call will fail if more than 10 requests are made in a minute', async () => {
    await clock.tick(60000);
    const responseText = [];
    for (let i = 0; i < 11; i++) {
      const response = await api.get('/api/cities/suggestions').query({
        q: 'lon',
        latitude: 43.70011,
        longitude: -79.4163,
        radius: 500,
        sort: 'name',
      });
      responseText.push(response.text);
    }
    expect(responseText[10]).toBe('Too many requests, please try again later.');
    expect(responseText[9]).toBe(
      '{"suggestions":[{"name":"London,08,CA","distance":167.32218325399222,"latitude":42.98339,"longitude":-81.23304},{"name":"Solon,OH,US","distance":306.1188401261756,"latitude":41.38978,"longitude":-81.44123}]}',
    );
  });

  test('API call will succeed if 10 or less requests are made in a minute', async () => {
    await clock.tick(60000);
    const responseText = [];
    for (let i = 0; i < 10; i++) {
      const response = await api.get('/api/cities/suggestions').query({
        q: 'lon',
        latitude: 43.70011,
        longitude: -79.4163,
        radius: 500,
        sort: 'name',
      });
      responseText.push(response.text);
    }
    responseText.forEach((element) => {
      expect(element).toBe(
        '{"suggestions":[{"name":"London,08,CA","distance":167.32218325399222,"latitude":42.98339,"longitude":-81.23304},{"name":"Solon,OH,US","distance":306.1188401261756,"latitude":41.38978,"longitude":-81.44123}]}',
      );
    });
  });

  test('API call will succeed if more than 10 requests are made in a minute from multiple IP addresses', async () => {
    app.enable('trust proxy');
    const responseText = [];
    for (let i = 0; i < 10; i++) {
      const response = await api
        .get('/api/cities/suggestions')
        .set('X-Forwarded-For', '127.0.0.1')
        .query({
          q: 'lon',
          latitude: 43.70011,
          longitude: -79.4163,
          radius: 500,
          sort: 'name',
        });
      responseText.push(response.text);
    }
    for (let i = 0; i < 10; i++) {
      const response = await api
        .get('/api/cities/suggestions')
        .set('X-Forwarded-For', '127.0.0.2')
        .query({
          q: 'lon',
          latitude: 43.70011,
          longitude: -79.4163,
          radius: 500,
          sort: 'name',
        });
      responseText.push(response.text);
    }
    responseText.forEach((element) => {
      expect(element).toBe(
        '{"suggestions":[{"name":"London,08,CA","distance":167.32218325399222,"latitude":42.98339,"longitude":-81.23304},{"name":"Solon,OH,US","distance":306.1188401261756,"latitude":41.38978,"longitude":-81.44123}]}',
      );
    });
  });
});
