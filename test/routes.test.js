const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const configuration = require('../knexfile')['test'];
const knex = require('knex')(configuration);

chai.use(chaiHttp);

describe('CLIENT routes', () => {
  it('should receive a response of a string when we hit the root endpoint', done =>{
    chai.request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        done();
      })
  });

  it('should return a 404 for a route that does not exist', done => {
    //define server
    chai.request(server)
      .get('/sad')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      })
  });
});


describe('API Routes', () => {
  beforeEach((done) => {
    // Here I would insert seed data that clears all data from each tabel
    beforeEach(() => knex.seed.run());
    done();
  });

  describe('GET /api/v1/projects', () => {
    it.skip('should return all of the projects', done => {
      chai.request(server)
      .get('/api/v1/projects')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('name');
        response.body[0].lastname.should.equal('Project 1');
        done();
      });
    });
  });

  describe('GET /api/v1/projects/:id/palettes', () => {
    it.skip('should return the specific ', done => {
      chai.request(server)
      .get('/api/v1/projects/:id/palettes')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        // Would need to check all properties and their datatypes
        done();
      });
    });
  });

  describe('POST /api/v1/projects', () => {
    it.skip('should create a new project', done => {
      chai.request(server)
      .post('/api/v1/projects')
      .send({
        name: 'Project 2'
      })
      .end((err, response) => {
        response.should.have.status(201); 
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        done();
      });
    });

    it.skip('should not create a record with missing data', done => {
      chai.request(server)
      .post('/api/v1/projects')
      .send({
        stuff: "wrong stuff"
      })
      .end((err, response) => {
        response.should.have.status(422);
        response.body.error.should.equal('You are missing data!');
        done();
      });
    });

    describe('POST /api/v1/projects/:id/palettes', () => {
      it.skip('should create a new project', done => {
        chai.request(server)
        .post('/api/v1/projects/:id/palettes')
        .send({
          name: "Project 3",
          color1: "#fff",
          color2: "#fff",
          color3: "#fff",
          color4: "#fff",
          color5: "#fff",
          projectID: "1"
        })
        .end((err, response) => {
          response.should.have.status(201); 
          response.body.should.be.a('object');
          response.body.should.have.property('name');
          done();
        });
      });
  
      it.skip('should not create a record with missing data', done => {
        chai.request(server)
        .post('/api/v1/')
        .send({
          shrek: "wut"
        })
        .end((err, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('You are missing data!');
          done();
        });
      });
  });
});