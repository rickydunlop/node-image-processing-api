import supertest from 'supertest';
import app from '../';

const temp = {};
const request = supertest.agent(app.listen());

describe('POST api/authenticate', () => {
  it('should return a token', (done) => {
    request
      .post('/v1/authenticate')
      .set('Accept', 'application/json')
      .send({
        password: 'bynd',
      })
      .expect(200, (err, res) => {
        temp.token = res.body.token;
        done();
      });
  });
});

describe('POST /upload', () => {
  it('should add an image', (done) => {
    request
      .post('/v1/upload')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${temp.token}`)
      .set('Accept', 'application/json')
      .attach('image', '__tests__/files/image.png')
      .expect(200, (err, res) => {
        temp.idImage = res.body._id;
        done();
      });
  });
});

describe('GET /images', () => {
  it('should get all images', (done) => {
    request
      .get('/v1/images')
      .set('Accept', 'application/json')
      .expect(200, (err, res) => {
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        done();
      });
  });
});

describe('GET /images/:id', () => {
  it('should get an image', (done) => {
    request
      .get(`/v1/images/${temp.idImage}`)
      .set('Accept', 'application/json')
      .expect(200, (err, res) => {
        expect(res.body._id).toEqual(temp.idImage);
        done();
      });
  });
});

describe('DELETE /images/id', () => {
  it('should delete an image', (done) => {
    request
      .delete(`/v1/images/${temp.idImage}`)
      .set('Authorization', `Bearer ${temp.token}`)
      .set('Accept', 'application/json')
      .expect(200, () => {
        done();
      });
  });

  it('should get error', (done) => {
    request
      .get(`/v1/images/${temp.idImage}`)
      .set('Accept', 'application/json')
      .expect(404, () => {
        done();
      });
  });
});
