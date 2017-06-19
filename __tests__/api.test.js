import supertest from 'supertest';
import app from '../server/';

const temp = {};
const request = supertest.agent(app.listen());

describe('POST api/authenticate', () => {
  it('should return a token', (done) => {
    request
      .post('/v1/authenticate')
      .set('Accept', 'application/json')
      .send({
        password: 'password',
      })
      .expect(200, (err, res) => {
        temp.token = res.body.token;
        done();
      });
  });
});

describe('POST /city', () => {
  it('should add a city', (done) => {
    request
      .post('/api/cities')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${temp.token}`)
      .set('Accept', 'application/json')
      .send({
        name: 'Bangkok',
        totalPopulation: 8249117,
        country: 'Thailand',
        zipCode: 1200,
      })
      .expect(200, (err, res) => {
        temp.idCity = res.body._id;
        done();
      });
  });
});

describe('GET /cities', () => {
  it('should get all cities', (done) => {
    request
      .get('/api/cities')
      .set('Authorization', `Bearer ${temp.token}`)
      .set('Accept', 'application/json')
      .expect(200, (err, res) => {
        expect(res.body.length).to.be.at.least(1);
        done();
      });
  });
});

describe('GET /cities/:id', () => {
  it('should get a city', (done) => {
    request
      .get(`/api/cities/${temp.idCity}`)
      .set('Authorization', `Bearer ${temp.token}`)
      .set('Accept', 'application/json')
      .expect(200, (err, res) => {
        res.body.name.should.equal('Bangkok');
        res.body.totalPopulation.should.equal(8249117);
        res.body.country.should.equal('Thailand');
        res.body.zipCode.should.equal(1200);
        res.body._id.should.equal(temp.idCity);
        done();
      });
  });
});

describe('DELETE /cities', () => {
  it('should delete a city', (done) => {
    request
      .delete(`/api/cities/${temp.idCity}`)
      .set('Authorization', `Bearer ${temp.token}`)
      .set('Accept', 'application/json')
      .expect(200, (err, res) => {
        done();
      });
  });

  it('should get error', (done) => {
    request
      .get(`/api/cities/${temp.idCity}`)
      .set('Accept', 'application/json')
      .expect(404, () => {
        done();
      });
  });
});
