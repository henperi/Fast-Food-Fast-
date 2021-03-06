import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';

import bodyHelper from './bodyDefinitions';

chai.use(chaiHttp);

const [expect] = [chai.expect];

/**
 * Test the users route and endpoints
 */
describe('Users Route Tests', () => {
  describe('POST /auth/signup', () => {
    it('should return error of one or more fields required are empty', (done) => {
      chai
        .request(server)
        .post('/api/v1/auth/signup')
        .send(bodyHelper.signUp.emptyData)
        .end((err, result) => {
          expect(result).to.have.status(400);
          expect(result.body).to.be.an('object');
          expect(result.body).to.be.have.property('errors');
          done();
        });
    });
    it('should return error if the fullname is undefined', (done) => {
      chai
        .request(server)
        .post('/api/v1/auth/signup')
        .send(bodyHelper.signUp.missingFullname)
        .end((err, result) => {
          expect(result).to.have.status(400);
          expect(result.body).to.be.an('object');
          expect(result.body).to.be.have.property('errors');
          done();
        });
    });
    it('should Create a user and store it in the database if the data sent is valid', (done) => {
      chai
        .request(server)
        .post('/api/v1/auth/signup')
        .send(bodyHelper.signUp.validData)
        .end((err, result) => {
          expect(result).to.have.status(201);
          expect(result.body).to.be.an('object');
          expect(result.body)
            .to.have.property('success')
            .to.equal(true);
          expect(result.body)
            .to.have.property('responseMsg')
            .to.equal('Signup Successful');
          bodyHelper.logIn.userExist.email = result.body.createdUser.email;
          done();
        });
    });
    it('should return error if the data sent conflicts with an existing user', (done) => {
      chai
        .request(server)
        .post('/api/v1/auth/signup')
        .send(bodyHelper.signUp.conflict_Data)
        .end((err, result) => {
          expect(result).to.have.status(409);
          expect(result.body)
            .to.have.property('success')
            .to.equal(false);
          expect(result.body).to.have.property('errors');
          done();
        });
    });
  });

  describe('POST /auth/login', () => {
    it('should return error for logging in a user with invalid or missing data', (done) => {
      chai
        .request(server)
        .post('/api/v1/auth/login')
        .send(bodyHelper.logIn.emptyData)
        .end((err, result) => {
          expect(result).to.have.status(400);
          expect(result.body).to.be.an('object');
          expect(result.body).to.have.property('errors');
          expect(result.body)
            .to.have.property('success')
            .to.equal(false);
          done();
        });
    });
    it('should not login a user if the email does not exist in the database', (done) => {
      chai
        .request(server)
        .post('/api/v1/auth/login')
        .send(bodyHelper.logIn.userNotExist)
        .end((err, result) => {
          expect(result).to.have.status(404);
          expect(result.body).to.be.an('object');
          expect(result.body.errors[0].msg).to.be.equal('email does not exist');
          done();
        });
    });
    it('should not login a user if the email exist but password is incorrect', (done) => {
      chai
        .request(server)
        .post('/api/v1/auth/login')
        .send(bodyHelper.logIn.wrongPassword)
        .end((err, result) => {
          expect(result).to.have.status(404);
          expect(result.body).to.be.an('object');
          expect(result.body.errors[0].msg).to.be.equal('password is wrong');
          done();
        });
    });
    it('should login a user if the email and password are valid in the database', (done) => {
      chai
        .request(server)
        .post('/api/v1/auth/login')
        .send(bodyHelper.logIn.userExist)
        .end((err, result) => {
          bodyHelper.userToken = result.body.userToken;
          expect(result).to.have.status(200);
          expect(result.body).to.be.an('object');
          expect(result.body.responseMsg).to.be.equal('signin successful');
          done();
        });
    });

    it('should return error when a user tries to access an admins endpoint', (done) => {
      console.log('bodyHelper.userToken', bodyHelper.userToken);
      chai
        .request(server)
        .get('/api/v1/users/')
        .set('x-access-token', bodyHelper.userToken)
        .end((err, result) => {
          expect(result).to.have.status(401);
          expect(result.body).to.be.an('object');
          expect(result.body.errors[0].msg).to.equal('Unauthorized access, only admins are allowed to do this');
          done();
        });
    });
  });

  describe('GET /users for Admins', () => {
    it('should login a valid admin and fetch his token', (done) => {
      chai
        .request(server)
        .post('/api/v1/auth/login')
        .send(bodyHelper.logIn.asAdmin)
        .end((err, result) => {
          expect(result).to.have.status(200);
          expect(result.body).to.be.an('object');
          expect(result.body.responseMsg).to.be.equal('signin successful');
          bodyHelper.adminToken = result.body.userToken;
          done();
        });
    });

    it('should return error if the token is not sent', (done) => {
      chai
        .request(server)
        .get('/api/v1/users/')
        .end((err, result) => {
          expect(result).to.have.status(400);
          expect(result.body).to.be.an('object');
          expect(result.body)
            .to.have.property('success')
            .to.equal(false);
          done();
        });
    });

    it('should return error if the token sent is of invalid format', (done) => {
      chai
        .request(server)
        .get('/api/v1/users/')
        .set('x-access-token', 'bodyHelper.signUp.validData.fullname')
        .end((err, result) => {
          expect(result).to.have.status(401);
          expect(result.body).to.be.an('object');
          expect(result.body)
            .to.have.property('success')
            .to.equal(false);
          done();
        });
    });

    // it('should return error if the token sent is of valid format but not found', (done) => {
    //   chai
    //     .request(server)
    //     .get('/api/v1/users/')
    //     .set('x-access-token', bodyHelper.randomValidToken)
    //     .end((err, result) => {
    //       expect(result).to.have.status(404);
    //       expect(result.body).to.be.an('object');
    //       expect(result.body)
    //         .to.have.property('success')
    //         .to.equal(false);
    //       done();
    //     });
    // });

    it('should fetch all the users from the database when an admin attempts to access', (done) => {
      chai
        .request(server)
        .get('/api/v1/users/')
        .set('x-access-token', bodyHelper.adminToken)
        .end((err, result) => {
          expect(result).to.have.status(200);
          expect(result.body).to.be.an('object');
          done();
        });
    });
  });
});
