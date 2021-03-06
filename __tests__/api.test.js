import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src';

const temp = {};

describe('App', () => {
  let server;
  let request;

  beforeAll(done => {
    server = app.listen(done);
    request = supertest.agent(server);
  });

  afterAll((done) => {
    server.close();
    mongoose.connection.close();
    done();
  });

  describe('POST api/authenticate', () => {
    it('should return a token', async () => {
      const res = await request
        .post('/v1/authenticate')
        .set('Accept', 'application/json')
        .send({
          password: 'bynd',
        })
        .expect(200);
      const { body } = res;
      temp.token = body.token;
    });
  });

  describe('POST /upload', () => {
    it('should add an image', async () => {
      const res = await request
        .post('/v1/upload')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${temp.token}`)
        .set('Accept', 'application/json')
        .attach('image', '__tests__/files/image.png')
        .expect(200);
      const { body } = res;
      temp.idImage = body.id;
    });
  });

  describe('GET /images', () => {
    it('should get all images', async () => {
      const res = await request
        .get('/v1/images')
        .set('Accept', 'application/json')
        .expect(200);
      const { body } = res;
      expect(body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /images/:id', () => {
    it('should get an image', async () => {
      const res = await request
        .get(`/v1/images/${temp.idImage}`)
        .set('Accept', 'application/json')
        .expect(200);
      const { body } = res;
      expect(body.id).toEqual(temp.idImage);
    });
  });

  describe('GET /resize/id', () => {
    it('should get a resized image', async () => {
      const res = await request
        .get(`/v1/resize/${temp.idImage}?width=200&height=200`)
        .set('Accept', 'application/json')
        .expect(200);
      const { body } = res;
      expect(body.width).toEqual(200);
      expect(body.height).toEqual(200);
    });

    it('should get error', (done) => {
      request
        .get(`/v1/resize/${temp.idImage}?width=10`)
        .set('Accept', 'application/json')
        .expect(422, done);
    });
  });

  describe('DELETE /images/id', () => {
    it('should delete an image', (done) => {
      request
        .delete(`/v1/images/${temp.idImage}`)
        .set('Authorization', `Bearer ${temp.token}`)
        .set('Accept', 'application/json')
        .expect(200, done);
    });

    it('should get error', (done) => {
      request
        .get(`/v1/images/${temp.idImage}`)
        .set('Accept', 'application/json')
        .expect(404, done);
    });
  });
});
